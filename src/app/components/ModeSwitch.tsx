import React, { useState } from "react";

interface ModeProps {
    mode: string;
    modes: string[];
    setter: (p: string) => void;
};

const STORED_PROVIDER_ID: string = "provider_id";


const ModeSwitch: React.FC<ModeProps> = ({mode, modes, setter }) => {
    let providerId;
    if (typeof localStorage !== "undefined") {
        providerId = localStorage?.getItem(STORED_PROVIDER_ID);
    }
    const [selected, setSelected] = useState<string>(mode);



    const handleModeChoice = (mode: string) => {
        setSelected(mode);
        setter(mode);
        // console.log("mode", mode);
        // console.log("selected!", selected)
    };

    const selectedClass = "scale-115 text-brand-primary bg-default-background rounded-sm";
    const defaultClass = "scale-95 text-black hover:scale-115 hover:text-brand-primary";


    return (
        <div className="p-2 flex justify-center items-center lg:px-0">
            <div className="p-2 flex items-center justify-evenly lg:px-0">
                {modes.map((mode, i) => {
                    return (
                        <span key={mode + i} className={`${selected.toLowerCase() === mode ? selectedClass : defaultClass} px-2 self-center cursor-pointer`}
                            onClick={(e) => handleModeChoice((e.target as HTMLSpanElement).innerText)}
                        >{mode.split('')[0].toUpperCase() + mode.slice(1, mode.length)}</span>
                    )
                })}
            </div>
        </div>
    )
}

export default ModeSwitch;
