import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "디앤씨웹툰 정식 연재 사이트",
  description: "국내 및 해외 정식 작품 플랫폼 링크를 모아 보는 카탈로그입니다.",
  icons: {
    icon: [{ url: "/dnc-webtoon-logo.jpg", type: "image/jpeg" }],
    shortcut: "/dnc-webtoon-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

