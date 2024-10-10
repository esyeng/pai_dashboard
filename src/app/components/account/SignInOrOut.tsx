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
        <div className="w-44 border border-mint rounded-lg flex justify-center items-center hover:bg-mint hover:duration-100">
            <SignOutButton signOutOptions={{ sessionId }} >
                <button className="p-4  cursor-crosshair  text-[#9de6ca] hover:duration-100 hover:text-caribbean-current text-md rounded leading-tight hover:scale-105" onClick={clearNoteUser}>Sign Out</button>
            </SignOutButton>
        </div>
    )
}
