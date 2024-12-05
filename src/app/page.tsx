import type { NextPage, Metadata } from "next";
import { MainContent } from "./components/MainContent";
// import { SidebarProvider } from "@/lib/hooks/use-sidebar";
import Image from "next/image";

export const metadata: Metadata = {
    title: "JasmynAI",
    description: "Private personal AI dashboard",
};

const Home: NextPage = () => {

    return (
        <div className="">
            <main>
                <MainContent />
            </main>
            <footer className="fixed bottom-0 w-full text-xs sm:py-2 text-center bg-default-background">
                <p className="text-brand-primary">
                    &copy; {new Date().getFullYear()} Esmé Keats. All rights
                    reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;
