"use client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Add clerk to Window to avoid type errors
declare global {
	interface Window {
		Clerk: any;
	}
}
export const createClerkSupabaseClient = () => {
	console.log("createClerkSupabaseClient", createClient);
	console.log("SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_KEY!,
		{
			global: {
				// Get the Supabase token with a custom fetch method
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

// import { auth } from "@clerk/nextjs/server";
// import { CookieOptions, createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
import { SUPABASE_PUB } from "@env";

// export async function createClerkSupabaseClient() {
// 	const cookieStore = cookies();
// 	const { getToken } = auth();

// 	const token = await getToken({ template: "supabase" });
// 	const authToken = token ? { Authorization: `Bearer ${token}` } : null;

// 	return createServerClient(
// 		process.env.NEXT_PUBLIC_SUPABASE_URL!,
// 		process.env.NEXT_PUBLIC_SUPABASE_KEY!,
// 		{
// 			global: { headers: { "Cache-Control": "no-store", ...authToken } },
// 			cookies: {
// 				get(name: string) {
// 					return cookieStore.get(name)?.value;
// 				},
// 				set(name: string, value: string, options: CookieOptions) {
// 					try {
// 						cookieStore.set({ name, value, ...options });
// 					} catch (error) {
// 						// Handle the error
// 					}
// 				},
// 				remove(name: string, options: CookieOptions) {
// 					try {
// 						cookieStore.set({ name, value: "", ...options });
// 					} catch (error) {
// 						// Handle the error
// 					}
// 				},
// 			},
// 		}
// 	);
// }
