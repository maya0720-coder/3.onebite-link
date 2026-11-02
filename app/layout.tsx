import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = "한입 링크";
const SITE_DESCRIPTION = "쌓아두기만 했던 링크를, 폴더로 깔끔하게 정리하세요.";

// 오픈그래프 이미지 같은 상대 경로를 절대 주소로 바꿀 때 쓰는 기준 주소.
// 배포할 때는 NEXT_PUBLIC_SITE_URL에 실제 도메인을 넣는다.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// 모든 페이지에 공통으로 들어가는 메타 태그.
// 각 페이지는 title만 지정하면 "페이지 이름 | 한입 링크" 형식이 된다.
// 파비콘은 app/favicon.ico 파일이 있으면 Next.js가 <link rel="icon">을 자동으로 넣어 준다.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/thumbnail.png",
        width: 2400,
        height: 1260,
        alt: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
