import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/"]);
const shouldRedirectIfAuthenticated = createRouteMatcher([
	"/sign-in",
	"/sign-up",
]); // '/signin' and '/signup' should redirect if authenticated

export default clerkMiddleware((auth, req) => {
	const { userId} = auth();

	if (isProtectedRoute(req)) {
		auth().protect();
	}

	// Redirect users who are already authenticated
	if (userId && shouldRedirectIfAuthenticated(req)) {
        const url = req.nextUrl?.clone();
        url.pathname = "/";
		return NextResponse.rewrite(url);
	}
});

export const config = {
	matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
