"use client";

import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import DateSelector from "./DateSelector";
import { useAssistants } from "@/contexts/AssistantContext";
import { useSearch } from "@/contexts/SearchContext";


export const SearchOptions: React.FC = () => {
    const [addExample, setAddExample] = useState<boolean>(false);
    const { modelId } = useAssistants()
    const {
        maxTurns,
        setMaxTurns,
        shouldQueryResearchModel,
        actionsToInclude,
        selectedActions,
        setSelectedActions,
        additionalInstructions,
        setAdditionalInstructions,
        example,
        setExample,
        character,
        setCharacter,
        setDisableQuery,
        disableQuery
    } = useSearch();

    const testObj = {
        "user_id": "user_2fcYxEZjvkR9JSYcPCWFArsVy4p",
        "question": "What are some fall women's fashion trends to look out for in NYC this fall?", "date": "November 2024",
        "max_turns": 2,
        "actions_to_include": selectedActions,
        "additional_instructions": "Search either wikipedia or google to find information relevant to the question",
        "model": "claude-3-5-sonnet-20241022",
        "example": "",
        "character": ""
    };

    const textareaClass = "w-full flex-grow p-2 mr-2 mb-2 border border-brand-primary rounded-xl max-h-[420px] shadow-m text-default-font bg-default-background min-h-20 py-2  pr-3 placeholder:text-default-font transition ease-in-out hover:bg-brand-500/30 focus:bg-brand-500/30 focus:outline-none duration-200 sm:text-sm resize-y "

    const handleSelectedToggle = (action: string) => {
        let newActions =
            selectedActions.includes(action)
                ? selectedActions.filter(a => a !== action)
                : [...selectedActions, action];
        setSelectedActions(newActions);
    };

    const handleInstructions = (instructions: string) => {
        setAdditionalInstructions(instructions);
    };

    const handleMaxTurns = (turns: number) => {
        setMaxTurns(turns);
    }

    const toggleField = (setter: Dispatch<SetStateAction<boolean>>, fieldBool: boolean) => setter(!fieldBool);

    const handleExample = (example: any) => {
        setExample(example);
    }

    const handleCharacter = (character: any) => {
        setCharacter(character);
    }


    useEffect(() => {
        console.log("Selected actions are", selectedActions);
        if (shouldQueryResearchModel) {
            setDisableQuery(selectedActions.length < 1 ? true : false);
        };
    }, [selectedActions]);

    useEffect(() => {
        console.log("disable query?", disableQuery);
    }, [disableQuery]);


    return ( // need form fields for each of the above state variables
        <div className="w-full py-8 px-2 flex flex-col items-center justify-around  md:flex-row rounded-xl bg-brand-50 sm:mb-12 xl:px-10">
            <div className=" w-full items-center justify-between font-mono text-sm lg:flex ">
                <div className="w-full flex flex-col items-start justify-center py-22">
                    <div className="flex w-full flex-col justify-center pr-4">
                        <span className="text-default-font text-lg py-2 pr-2 rounded leading-tight">Search Tools: </span>
                        {actionsToInclude.map(action => (
                            <div className="px-4 py-2 rounded w-full" key={action}>

                                <label className=" flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedActions.includes(action)}
                                        onChange={() => handleSelectedToggle(action)}
                                        className=" text-brand-primary bg-default-background"
                                    />
                                    <span className="text-default-font px-2">{action.split('')[0].toUpperCase() + action.slice(1, action.length).replace(/[^a-zA-Z\d\s]/g, " ").trim()}</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <span className="text-default-font text-lg py-2 pr-2 rounded leading-tight">Iterations to run: </span>
                    <input
                        type="number"
                        id="max-turns"
                        value={maxTurns}
                        onChange={(e) => handleMaxTurns(parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="block w-full px-4 py-2 text-default-font bg-default-background border rounded-md shadow-sm border-brand-primary pl-9 pr-3 placeholder:text-default-font transition ease-in-out hover:bg-brand-500/10 focus:bg-brand-500/10 focus:outline-none  duration-200 sm:text-sm resize-none hover:resize-y sm:w-full"
                        placeholder="1"
                    />

                    <span className="text-default-font text-lg py-2 pr-2 rounded leading-tight">Additional Instructions: </span>
                    <textarea
                        className={textareaClass}
                        placeholder="Specify any additional instructions here..."
                        onChange={(e) => handleInstructions(e.target.value)}
                    />

                    <DateSelector />

                    <span className="text-default-font text-lg py-2 pr-2 rounded leading-tight">AI Character Role Notes: </span>

                    <textarea
                        className={textareaClass}
                        placeholder="Inform the AI of its role in the conversation..."
                        onChange={(e) => handleCharacter(e.target.value)}
                    />
                    <div className="flex align-center justify-between">

                        <span className="text-default-font text-lg py-2 pr-2 rounded leading-tight">Check to provide example for agent</span>
                        <input
                            type="checkbox" checked={addExample} className="bg-default-background text-brand-primary p-2 m-2 self-center" onChange={() => toggleField(setAddExample, addExample)} />
                    </div>
                    {addExample &&

                        <textarea
                            className={textareaClass}
                            placeholder="Provide an example of the thought process you'd like agent to follow..."
                            onChange={(e) => handleExample(e.target.value)}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

