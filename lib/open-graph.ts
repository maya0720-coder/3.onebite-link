export type OpenGraph = {
  title: string;
  description: string;
  image?: string;
  url: string;
};

const FETCH_TIMEOUT_MS = 5000;
// Microlink는 대상 페이지를 대신 열어 보느라 시간이 더 걸린다.
const MICROLINK_TIMEOUT_MS = 10000;

export function parseHttpUrl(value: string): URL | undefined {
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return url;
  } catch {}
}

export async function fetchOpenGraph(target: URL): Promise<OpenGraph> {
  const res = await fetch(target, {
    headers: {
      // 일부 사이트는 브라우저가 아닌 요청에 OG 태그를 내려주지 않는다.
      "User-Agent": "Mozilla/5.0 (compatible; OnebiteLinkBot/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  // 리다이렉트를 따라간 경우 최종 주소를 기준으로 상대 경로를 해석한다.
  const pageUrl = new URL(res.url || target.href);

  // 사이트는 응답했지만 서버 요청을 막는 경우(예: 403)가 있다.
  // 이때는 외부 링크 미리보기 서비스(Microlink)에 물어보고,
  // 그마저 실패하면 주소 자체는 살아 있으므로 제목을 도메인 이름으로 대신해 저장한다.
  if (!res.ok) {
    return (
      (await fetchFromMicrolink(target)) ?? {
        title: pageUrl.hostname,
        description: "",
        url: pageUrl.href,
      }
    );
  }

  const html = await readHtml(res);
  const meta = parseMetaTags(html);

  const title =
    meta.get("og:title") ?? meta.get("twitter:title") ?? parseTitleTag(html) ?? pageUrl.hostname;
  const description =
    meta.get("og:description") ?? meta.get("twitter:description") ?? meta.get("description") ?? "";
  const image = meta.get("og:image") ?? meta.get("og:image:url") ?? meta.get("twitter:image");
  const url = meta.get("og:url");

  return {
    title: title.trim(),
    description: description.trim(),
    image: image && resolveUrl(image, pageUrl),
    url: (url && resolveUrl(url, pageUrl)) ?? pageUrl.href,
  };
}

type MicrolinkResponse = {
  status: string;
  // Microlink가 대상 페이지를 열었을 때 받은 HTTP 상태 코드
  statusCode?: number;
  data?: {
    title?: string | null;
    description?: string | null;
    url?: string | null;
    image?: { url?: string | null } | null;
  };
};

// Microlink(https://microlink.io) 링크 미리보기 API.
// 회원 정보는 보내지 않고 링크 주소만 보낸다.
// 키 없이 쓰면 하루 사용량 제한이 있으므로, 키가 있으면 MICROLINK_API_KEY에 넣어 유료 엔드포인트를 쓴다.
// 실패하면 undefined를 돌려줘 호출한 쪽이 기본값을 쓰게 한다.
async function fetchFromMicrolink(target: URL): Promise<OpenGraph | undefined> {
  const apiKey = process.env.MICROLINK_API_KEY;
  const endpoint = new URL(apiKey ? "https://pro.microlink.io/" : "https://api.microlink.io/");
  endpoint.searchParams.set("url", target.href);

  try {
    const res = await fetch(endpoint, {
      headers: apiKey ? { "x-api-key": apiKey } : undefined,
      signal: AbortSignal.timeout(MICROLINK_TIMEOUT_MS),
    });
    if (!res.ok) return undefined;

    const { status, statusCode, data } = (await res.json()) as MicrolinkResponse;
    if (status !== "success" || !data?.title) return undefined;
    // Microlink도 사이트에 막히면 "접근 권한 없음" 같은 오류 페이지 내용을 돌려준다.
    // 그런 내용을 링크 설명으로 저장하지 않도록 버린다.
    if (statusCode !== undefined && statusCode >= 400) return undefined;

    const pageUrl = parseHttpUrl(data.url ?? "") ?? target;
    return {
      title: data.title.trim(),
      description: (data.description ?? "").trim(),
      image: data.image?.url ? resolveUrl(data.image.url, pageUrl) : undefined,
      url: pageUrl.href,
    };
  } catch {
    return undefined;
  }
}

// EUC-KR 등 UTF-8이 아닌 페이지도 깨지지 않도록 charset을 찾아 디코딩한다.
async function readHtml(res: Response): Promise<string> {
  const buffer = await res.arrayBuffer();
  const head = new TextDecoder("latin1").decode(buffer.slice(0, 2048));
  const charset =
    res.headers.get("content-type")?.match(/charset=["']?([\w-]+)/i)?.[1] ??
    head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ??
    "utf-8";

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
}

function parseMetaTags(html: string): Map<string, string> {
  const meta = new Map<string, string>();

  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = parseAttributes(tag);
    const key = (attrs.property ?? attrs.name)?.toLowerCase();
    const content = attrs.content;
    // 같은 키가 여러 번 나오면 첫 번째 값을 사용한다.
    if (key && content && !meta.has(key)) {
      meta.set(key, decodeEntities(content));
    }
  }

  return meta;
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const [, name, , value1, value2, value3] of tag.matchAll(
    /([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g,
  )) {
    attrs[name.toLowerCase()] = value1 ?? value2 ?? value3 ?? "";
  }
  return attrs;
}

function parseTitleTag(html: string): string | undefined {
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  return title ? decodeEntities(title) : undefined;
}

function resolveUrl(value: string, base: URL): string | undefined {
  try {
    return parseHttpUrl(new URL(value, base).href)?.href;
  } catch {}
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (entity, code: string) => {
    if (code[0] === "#") {
      const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(point) ? entity : String.fromCodePoint(point);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
  });
}
