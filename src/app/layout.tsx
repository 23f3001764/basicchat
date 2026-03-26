import "./globals.css";
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

        {children}

        {/* POPUP */}
        <NewsPopup />

      </body>
    </html>
  );
}