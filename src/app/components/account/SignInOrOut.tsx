"use client";

import React from "react";
import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs';

export const SignInOrOut: React.FC = () => {
    const { sessionId } = useAuth();

    const clearNoteUser = () => {
        console.log("clearing note user id, current val is", localStorage.getItem("note user id"));
        localStorage.setItem("note user id", "");
    }

    if (!sessionId) {
        return (
            <div>
                <SignInButton />
            </div>
        )
    }

    return (
        <div>
            <SignOutButton signOutOptions={{ sessionId }} >
                <button onClick={clearNoteUser}>Sign Out</button>
            </SignOutButton>
        </div>
    )
}
