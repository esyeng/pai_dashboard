"use client";

import { Inter } from "next/font/google";
import { ChatProvider } from "@/contexts/ChatContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.className}`}>
				<ChatProvider>
					<div className="container mx-auto">{children}</div>
				</ChatProvider>
			</body>
			<footer className="py-4 text-center">
				<p className="text-mint">
					&copy; {new Date().getFullYear()} Esmé Keats. All rights
					reserved.
				</p>
			</footer>
		</html>
	);
}

// dark:bg-tropical-indigo
