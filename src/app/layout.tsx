"use client";

import { Inter } from "next/font/google";
import { ChatProvider } from "@/contexts/ChatContext";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${inter.className}`}>
					<ChatProvider>
						<div className="container mx-auto">{children}</div>
					</ChatProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

// dark:bg-tropical-indigo
