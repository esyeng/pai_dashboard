"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import dotenv from "dotenv";
dotenv.config();

// Add clerk to Window to avoid type errors
declare global {
    interface Window {
        Clerk: any;
    }
}

// Create a custom hook to manage the Supabase client
export function useSupabaseClient() {
    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);

    useEffect(() => {
        let client: SupabaseClient | null = null;

        const initializeClient = async () => {
            if (!window.Clerk) {
                console.error("Clerk is not available");
                return;
            }

            const createClientWithToken = async () => {
                const clerkToken = await window.Clerk.session?.getToken({
                    template: "supabase",
                });

                return createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
                    {
                        global: {
                            headers: {
                                Authorization: `Bearer ${clerkToken}`,
                            },
                        },
                    }
                );
            };

            client = await createClientWithToken();
            setSupabaseClient(client);

            // Listen for auth state changes
            window.Clerk.addListener(async (event: any) => {
                if (event.type === "session.updated" || event.type === "session.created") {
                    // Recreate the client with the new token
                    client = await createClientWithToken();
                    setSupabaseClient(client);
                }
            });
        };

        initializeClient();

        // Cleanup function
        return () => {
            if (window.Clerk) {
                window.Clerk.removeAllListeners();
            }
            if (client) {
                client.removeAllChannels();
            }
        };
    }, []);

    return supabaseClient;
}
