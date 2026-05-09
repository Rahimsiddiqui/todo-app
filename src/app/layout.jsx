import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { TaskProvider } from "@/context/TaskContext";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

/**
 * Root Layout component that provides global font variables and the TaskProvider context.
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${jetbrainsMono.variable} dark h-full w-full overflow-hidden antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
