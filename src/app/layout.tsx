import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SageStream",
  description: "Learn with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen`}>
        <div className="nav min-h-10 bg-slate-900 flex">
          <div className="text-3xl tracking-tight font-semibold p-2 text-[#7582ff]">
            SageStream
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
