import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "@/context/TaskContext";
import { LazyMotion, domMax } from "framer-motion";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Aura Todo",
  description: "Minimalist Todo App",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased overflow-x-hidden!">
        <LazyMotion features={domMax}>
          <TaskProvider>{children}</TaskProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
