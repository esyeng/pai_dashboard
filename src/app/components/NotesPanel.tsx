"use client";

import React, { useState, useEffect } from "react";

const NotesPanel: React.FC = () => {
    const [notes, setNotes] = useState("");

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
        <div className="flex flex-col mb-4 flex-1 w-full h-full">
            <h2 className="flex-1 text-lg text-[#cfedf0] font-bold border-b-1  rounded-tr-lg p-4 bg-transparent border-[#4ce6ab2d] border-4 ">
                Notes
            </h2>
            <textarea
                className="max-h-[36rem] min-h-24 border-[#4ce6ab2d] border-4 border-t-1 rounded-b-xl shadow-m bg-[#fff1c000] text-[#cfedf0] border-slate-300 py-2 pl-9 pr-3 placeholder:text-[#85d7de] transition ease-in-out hover:bg-mint/20 focus:bg-mint/20 focus:border-sky-500 focus:ring-sky-500  focus:ring-offset-1 focus:ring-offset-[#5bdde8] duration-200 w-full  border-gray-300 focus:ring-2 focus:ring-blue-500 resize-y"
                value={notes}
                onChange={handleNotesChange}
                placeholder="Write your notes here..."
            />
        </div>
    );
};

export default NotesPanel;



/**
 * if (user && user.id) {
            console.log(`checking notes for ${user.firstName}`)
            if (!lastNoteUser) {
                console.log(`${user.firstName} has not had id logged for notepad`)
                localStorage.setItem("note user id", user.id);
            } else if (storedNotes && lastNoteUser !== user.id) {
                console.log(`${user.firstName}'s user id does not match the locally stored note user id, clearing notes and setting note user to ${user.firstName}'s id.`)
                setNotes("")
                localStorage.setItem("note user id", user.id)
            }
            if (storedNotes && lastNoteUser === user.id) {
                console.log("last note user is current user")
                setNotes(storedNotes);
            }
        } else {
            console.log("no user and user id in NotesPanel")
        }
 */
