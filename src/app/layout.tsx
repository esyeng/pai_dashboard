import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Personal AI Web App",
  description: "Your personal AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div className="container mx-auto">{children}</div>
      </body>
    </html>
  );
}

// dark:bg-tropical-indigo
