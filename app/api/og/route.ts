import { fetchOpenGraph, parseHttpUrl } from "@/lib/open-graph";

// GET /api/og?url=https://example.com
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = parseHttpUrl(searchParams.get("url") ?? "");

  if (!target) {
    return Response.json({ error: "올바른 링크 주소를 입력해주세요." }, { status: 400 });
  }

  try {
    return Response.json(await fetchOpenGraph(target));
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return Response.json({ error: `링크 정보를 가져오지 못했어요. ${message}` }, { status: 502 });
  }
}
