"use client";

import { Inter } from "next/font/google";
import { ChatProvider } from "@/contexts/ChatContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/lib/hooks/use-sidebar";
import "./globals.css";
import ErrorBoundary from './components/ErrorBoundary';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" className="bg-default-background">
                <body className={`h-full ${inter.className}`}>
                    <AuthProvider>
                        <ChatProvider>
                            <ErrorBoundary>
                                <SidebarProvider>
                                    <div>{children}</div>
                                </SidebarProvider>
                            </ErrorBoundary>
                        </ChatProvider>
                    </AuthProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}

// dark:bg-tropical-indigo
