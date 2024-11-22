"use client";

import { Inter } from "next/font/google";
import { ChatProvider } from "@/contexts/ChatContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
				<body className={`h-full ${inter.className}`}>
                <AuthProvider>
					<ChatProvider>
						<div className="container mx-auto">{children}</div>
					</ChatProvider>
                </AuthProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

// dark:bg-tropical-indigo
