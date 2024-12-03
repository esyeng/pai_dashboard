import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from "react";
import {
    fetchUser,
} from "../lib/api";
import { useAuth } from "@clerk/nextjs";

/**
 * AuthContext.tsx
 */

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [token, setToken] = useState<
        any | Promise<string> | string | undefined
    >();
    const [latestToken, setLatestToken] = useState<
        any | Promise<string> | string | undefined
    >();
    const { getToken } = useAuth();
    const [user, setUser] = useState<UserResponse | User | null>(null);
    const [loadComplete, setLoadComplete] = useState<boolean>(false);


    // ****** effects *******

    useEffect(() => {
        const refreshInterval = setInterval(() => {
            setLatestToken(getToken())
        }, 50000);

        return () => {
            clearInterval(refreshInterval);
        }
    }, [])

    // sets loadComplete once token promise resolves
    useEffect(() => {
        if (token) {
            setLoadComplete(true);
        }
        return () => {
            if (loadComplete) {
                console.log(`effect cleanup for loadComplete initialized, value: ${loadComplete}`);
            }
        };
    }, [token]);

    // executes once token promise resolves, fetches and sets user data
    useEffect(() => {
        if (loadComplete) {
            fetchUserData();
        }
    }, [loadComplete, token]);

    /**
    * @method fetchUserData
    * @returns authenticatedUserObject: any
    */
    const fetchUserData = useCallback(async () => {
        try {
            if (!token) return;
            // once clerkAuth request completes the following executes
            const fetchedUserData = await fetchUser(token);
            console.log("fetchedUserData", fetchedUserData);
            setUser(fetchedUserData);
            clearNoteStorage(fetchedUserData);

        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }, [token]);


    const clearNoteStorage = (user: User) => {
        const noteId = localStorage.getItem("note user id");
        if (!user) {
            localStorage.setItem("notes", "");
            localStorage.setItem("note user id", "");
        } else if (noteId !== "") {
            if (noteId !== user.id) {
                localStorage.setItem("notes", "");
                localStorage.setItem("note user id", user.id ? user.id : "");
            }
        } else {
            localStorage.setItem("note user id", user.id ? user.id : "");
        }
    };


    return (
        <AuthContext.Provider
            value={{ token, latestToken, user, loadComplete, setToken, setLatestToken, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useJasmynAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useJasmynAuth must be used within a AuthProvider");
    }
    return context;
}
