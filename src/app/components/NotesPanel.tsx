"use client";

import React, { useState, useEffect } from "react";

const NotesPanel: React.FC = () => {
    const [notes, setNotes] = useState("");
    const [open, setOpen] = useState<boolean>(true);

    useEffect(() => {
        const storedNotes = localStorage.getItem("notes");
        if (storedNotes) {
            console.log("last note user is current user")
            setNotes(storedNotes);
        }
    }, []);

    const handleNotesChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const newNotes = event.target.value;
        setNotes(newNotes);
        localStorage.setItem("notes", newNotes);
    };


    return (
        <div className="flex flex-col mb-4 flex-1 w-full h-1/2">
            <div className="flex justify-between items-center p-2 bg-gradient-to-b from-[#4ce6ab2d] to-[#0ea46a3b] bg-opacity-85 rounded-tl-lg rounded-tr-lg" >
                <h2 className="flex-1 text-xl text-white mb-2 font-bold border-b-1  rounded-tr-lg p-4 ">
                    Notes
                </h2>

                <span className={`${open ? "" : ""} cursor-pointer border-2 border-mint p-2 rounded-lg hover:scale-105 hover:text-mint text-sm`} onClick={() => setOpen(prev => !prev)}>{open ? "Hide" : "Expand"}</span>
            </div>

            {open && (
                <textarea
                    className="max-h-[36rem] min-h-24 border-[#4ce6ab2d] border-4 border-t-1 rounded-b-xl shadow-m bg-[#fff1c000] text-[#cfedf0] border-slate-300 py-2 pl-9 pr-3 placeholder:text-[#85d7de] transition ease-in-out hover:bg-mint/20 focus:bg-mint/20 focus:border-sky-500 focus:ring-sky-500  focus:ring-offset-1 focus:ring-offset-[#5bdde8] duration-200 w-full  border-gray-300 focus:ring-2 focus:ring-blue-500 resize-y"
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Write your notes here..."
                />
            )}
        </div>
    );
};

export default NotesPanel;
