import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/"]);
const shouldRedirectIfAuthenticated = createRouteMatcher([
	"/sign-in",
	"/sign-up",
]); // Assuming '/signin' and '/signup' should redirect if authenticated

export default clerkMiddleware((auth, req) => {
	const { sessionId, userId } = auth();
	console.log(`sessionId: ${sessionId}, userId: ${userId}`);

	if (isProtectedRoute(req)) {
		auth().protect();
	}

	// Redirect users who are already authenticated
	if (userId && shouldRedirectIfAuthenticated(req)) {
		return NextResponse.redirect("/");
	}
});

export const config = {
	matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
