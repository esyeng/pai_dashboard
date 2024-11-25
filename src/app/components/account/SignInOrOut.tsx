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
                <SignInButton>Sign In</SignInButton>
            </div>
        )
    }

    return (
        <div className=" mx-4 cursor-pointer text-center border border-brand-primary text-default-font bg-brand-50 rounded-sm justify-center items-center  hover:duration-100 hover:bg-brand-primary hover:text-black">
            <SignOutButton signOutOptions={{ sessionId }} >
                <button className="p-2 text-carribean-current text-md rounded leading-tight hover:duration-100 " onClick={clearNoteUser}>Sign Out</button>
            </SignOutButton>
        </div>
    )
}
