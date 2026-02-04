import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VPS Kairosoft - 開羅風格 VPS 管理工具",
  description: "像素藝術風格的 VPS 可視化管理工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
