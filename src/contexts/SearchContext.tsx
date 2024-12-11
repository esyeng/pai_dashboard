import React, { createContext, useContext, useState, useEffect } from "react";
import { useAssistants } from "./AssistantContext";

interface SearchProviderProps {
    children: React.ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);


export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    // const { claudeModels, veniceModels, modelId, agentId, setModelId, setProvider, setAgentId, prompts } = useAssistants();
    const [shouldQueryResearchModel, setShouldQueryResearchModel] =
        useState<boolean>(false);
    // Research model query parameters
    const [maxTurns, setMaxTurns] = useState<number>(5);
    const [selectedActions, setSelectedActions] = useState<string[]>(["wikipedia", "google"]);
    const [additionalInstructions, setAdditionalInstructions] =
        useState<string>("");
    const [example, setExample] = useState<string>("");
    const [character, setCharacter] = useState<string>("");
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const [disableQuery, setDisableQuery] = useState<boolean>(false);
    const actionsToInclude = ["wikipedia", "google", "process_urls", "write_report"];


    return <SearchContext.Provider value={{
        maxTurns,
        shouldQueryResearchModel,
        selectedActions,
        actionsToInclude,
        additionalInstructions,
        example,
        character,
        month,
        months,
        year,
        disableQuery,
        setDisableQuery,
        setYear,
        setMonth,
        setCharacter,
        setExample,
        setAdditionalInstructions,
        setSelectedActions,
        setShouldQueryResearchModel,
        setMaxTurns

    }} >
        {children}
    </SearchContext.Provider>
}

export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("Can only use useSearch within SearchProvider");
    }
    return context;
}
