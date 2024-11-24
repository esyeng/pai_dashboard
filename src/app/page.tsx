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
			<main className="container flex h-full flex-col items-center justify-between px-0 py-2 ">

				<MainContent />

				<div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
			</main>
			<footer className="py-4 text-center">
				<p className="text-mint">
					&copy; {new Date().getFullYear()} Esmé Keats. All rights
					reserved.
				</p>
			</footer>
		</div>
	);
};

export default Home;
