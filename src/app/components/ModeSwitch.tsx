import React, { useState, useEffect } from "react";

interface ModeProps {
    modes: string[];
    setter: (p: any) => void;
};

const ModeSwitch: React.FC<ModeProps> = ({ modes, setter }) => {
    const [selected, setSelected] = useState<string>(modes[0]);

    const handleModeChoice = (mode: string) => {
        setSelected(mode);
        setter(mode);
        // console.log("selected!", selected)
    };

    const selectedClass = "scale-115 text-brand-primary bg-default-background rounded-sm";
    const defaultClass = "scale-95 text-black hover:scale-115 hover:text-brand-primary";


    return (
        <div className="p-2 flex justify-center items-center w-full">
            <div className="p-2 flex items-center justify-evenly">
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
