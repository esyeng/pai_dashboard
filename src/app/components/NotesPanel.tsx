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
        <div className="h-1/2 mb-2 flex-1 w-full  border-brand-50 rounded-tl-lg rounded-tr-lg rounded-bl-sm rounded-br-sm">
            <div className={`flex sm:flex-col md:flex-row  justify-between items-center p-2 bg-brand-50 ${open ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg"} `} >
                <h2 className="text-sm text-default-font/70  font-bold p-4 md:text-md lg:text-xl">
                    Notes
                </h2>

                <span className={`${open ? "" : ""}sm:w-full md:w-20 text-brand-primary cursor-pointer border-2 border-brand-primary p-2 rounded-sm hover:scale-105 hover:text-default-font text-sm`} onClick={() => setOpen(prev => !prev)}>{open ? "Hide" : "Expand"}</span>
            </div>

            {open && (
                <textarea
                    className="max-h-64 min-h-36 border-t-0 border-b-2 border-b-brand-primary rounded-b-xl bg-neutral-50 text-brand-primary border-x-brand-primary py-2 pl-9 pr-3 text-sm placeholder:text-brand-primary transition ease-in-out hover:bg-brand-400/30 focus:bg-brand-300/30 duration-200 w-full resize-y"
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Write your notes here..."
                />
            )}
        </div>
    );
};

export default NotesPanel;
