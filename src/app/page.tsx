import type { NextPage, Metadata } from 'next';

export const metadata: Metadata = {
    title: "JasmynAI",
    description: "Private personal AI dashboard",
}
import Image from "next/image";
import { ChatWindow } from './components/ChatWindow';


const Home: NextPage = () => {


    return (
        <div className="container mx-auto">
            <main className="flex min-h-screen flex-col items-center justify-between p-14">
                <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">

                    <div className="bottom-0 left-0 flex h-10 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                        <h1 className="flex place-items-center gap-2 p-8 lg:p-0">
                            JasmynAI
                        </h1>
                    </div>
                </div>
                <ChatWindow agentId='test' />

                <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
                </div>
            </main>
            <footer className="py-4 text-center">
                <p>&copy; {new Date().getFullYear()} Esmé Keats. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;

{/* <h1 className="text-4xl font-bold mb-8">Welcome to Your Personal AI Web App!</h1> */ }

{/* Add your main content and components here */ }
//   <div className="mb-8">
//     {/* AgentDropdown component */}
//   </div>

//   <div className="mb-8">
//     {/* OptionsPanel component */}
//   </div>

//   <div className="flex-grow">
//     {/* ChatWindow component */}
//   </div>

//   <div className="fixed bottom-0 right-0 m-4">
//     {/* NotesPanel component */}
//   </div>

{/* Auth component */ }

/**
 * <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        -&gt;
      </span>


      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
 */
