// src/app/layout.tsx

import "./globals.css";
import NewsPanel from "@/components/NewsPanel";
import NewsPopup from "@/components/NewsPopup";

export const metadata = {
  title: "STEAMI",
  description: "Chat + AI News",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-black text-white">
        
        <div className="flex h-full w-full">

          {/* 🔥 LEFT MAIN APP */}
          <div className="flex-1 relative overflow-hidden">
            {children}
          </div>

          {/* 🔥 RIGHT NEWS PANEL (FORCE VISIBLE) */}
          <div className="w-[320px] h-full bg-black border-l border-white/20 z-50">
            <NewsPanel />
          </div>

        </div>

        {/* 🔥 POPUP */}
        <NewsPopup />

      </body>
    </html>
  );
}