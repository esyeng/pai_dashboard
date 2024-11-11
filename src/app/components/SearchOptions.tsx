"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";


export const SearchOptions: React.FC = () => {
    const {
        modelId,
        date,
        setDate,
        maxTurns,
        setMaxTurns,
        actionsToInclude,
        setActionsToInclude,
        additionalInstructions,
        setAdditionalInstructions,
        example,
        setExample,
        character,
        setCharacter
    } = useChat();

    const [selectedActions, setSelectedActions] = useState<string[]>(["wikipedia", "google"]);

    const handleSelectedToggle = (action: string) => {
        setSelectedActions(prevSelectedActions =>
            prevSelectedActions.includes(action)
                ? prevSelectedActions.filter(a => a !== action)
                : [...prevSelectedActions, action]
        );
    };

    const handleInstructions = (instructions: any) => {
        setAdditionalInstructions(instructions);
    };

    const handleActions = (actions: any) => {
        setActionsToInclude(actions);
    }

    // const handleDate = (date: any) => {
    //     setDate(date);
    // }

    // const handleMaxTurns = (turns: any) => {
    //     setMaxTurns(turns);
    // }

    // const handleExample = (example: any) => {
    //     setExample(example);
    // }

    const handleCharacter = (character: any) => {
        setCharacter(character);
    }




    return ( // need form fields for each of the above state variables
        <div className="w-full py-8 flex flex-col items-center justify-around  md:flex-row">
            <div className=" w-full items-center justify-between font-mono text-sm lg:flex ">
                <div className="w-full flex flex-col items-start justify-center py-22">
                    <div className="flex w-full flex-col justify-center ">
                        <span className="text-[#85d7de] text-lg py-2 pr-2 rounded leading-tight">Search Tools: </span>
                        {actionsToInclude.map(action => (
                            <div className="px-4 py-2 rounded w-full" key={action}>


                                <label  className=" flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedActions.includes(action)}
                                        onChange={() => handleSelectedToggle(action)}
                                        className="form-checkbox text-blue-600"
                                    />
                                    <span className="text-mint px-2">{action.split('')[0].toUpperCase() + action.slice(1, action.length)}</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <span className="text-[#85d7de] text-lg py-2 pr-2 rounded leading-tight">Additional Instructions: </span>

                    <textarea
                        className="flex-grow p-2 m-2 border border-mint rounded-xl max-h-[420px] shadow-m bg-[#fff1c000] text-[#85d7de] border-slate-300 py-2 pl-9 pr-3 placeholder:text-[#85d7de] transition ease-in-out hover:bg-mint/20 focus:bg-mint/20 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#5bdde8] duration-200 sm:text-sm resize-none hover:resize-y sm:w-full"
                        placeholder="Specify any additional instructions here..."
                        onChange={(e) => handleInstructions(e.target.value)}
                    />

                    <span className="text-[#85d7de] text-lg py-2 pr-2 rounded leading-tight">AI Character Role Notes: </span>

                    <textarea
                        className="flex-grow p-2 m-2 border border-mint rounded-xl max-h-[420px] shadow-m bg-[#fff1c000] text-[#85d7de] border-slate-300 py-2 pl-9 pr-3 placeholder:text-[#85d7de] transition ease-in-out hover:bg-mint/20 focus:bg-mint/20 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#5bdde8] duration-200 sm:text-sm resize-none hover:resize-y sm:w-full"
                        placeholder="Inform the AI of its role in the conversation..."
                        onChange={(e) => handleCharacter(e.target.value)}
                    />
                </div>



            </div>

        </div>
    );
};

