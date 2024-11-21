// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Add clerk to Window to avoid type errors
declare global {
    interface Window {
        Clerk: any;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
    const [latestToken, setLatestToken] = useState<string | null>(null);

    useEffect(() => {
        let client: SupabaseClient | null = null;
        let unsubscribe: (() => void) | null = null;

        const initializeAuth = async () => {
            if (!window.Clerk) {
                console.error("Clerk is not available");
                return;
            }

            const createClientWithToken = async () => {
                const clerkToken = await window.Clerk.session?.getToken({
                    template: "supabase",
                });

                setLatestToken(clerkToken);

                return createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
                    {
                        global: {
                            fetch: async (url, options = {}) => {
                                const clerkToken = await window.Clerk.session?.getToken({
                                    template: "supabase",
                                });

                                // Construct fetch headers
                                const headers = new Headers(options?.headers);
                                headers.set("Authorization", `Bearer ${clerkToken}`);

                                // Now call the default fetch
                                return fetch(url, {
                                    ...options,
                                    headers,
                                });
                            },
                        },
                    }
                );
            };

            client = await createClientWithToken();
            setSupabaseClient(client);

            // Listen for auth state changes
            unsubscribe = window.Clerk.addListener(async (event: any) => {
                if (event.type === "session.updated" || event.type === "session.created") {
                    // Recreate the client with the new token
                    client = await createClientWithToken();
                    setSupabaseClient(client);
                }
            });
        };

        initializeAuth();

        // Cleanup function
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            if (client) {
                client.removeAllChannels();
            }
        };
    }, []);

    const getLatestToken = async () => {
        if (window.Clerk) {
            const token = await window.Clerk.session?.getToken({
                template: "supabase",
            });
            setLatestToken(token);
            return token;
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{ supabaseClient, latestToken, getLatestToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
