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
        <div className="w-44 cursor-pointer absolute right-4 border border-mint rounded-lg flex justify-center items-center  hover:duration-100 hover:bg-mint hover:text-caribbean-current">
            <SignOutButton signOutOptions={{ sessionId }} >
                <button className="p-2 text-carribean-current text-md rounded leading-tight hover:duration-100 " onClick={clearNoteUser}>Sign Out</button>
            </SignOutButton>
        </div>
    )
}
