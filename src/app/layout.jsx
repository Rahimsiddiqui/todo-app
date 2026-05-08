import { GeistSans } from "geist/font/sans";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} dark h-full w-full overflow-hidden antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
