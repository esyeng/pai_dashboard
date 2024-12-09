"use client";

import React from 'react';

interface YearInputProps {
    label: string;
    value: number;
    onChange: (year: number) => void;
}

const YearInput: React.FC<YearInputProps> = ({ label, value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputYear = parseInt(e.target.value, 10);
        if (!isNaN(inputYear) && inputYear >= 1900 && inputYear <= 2100) {
            onChange(inputYear);
        }
    };

    return (
        <div className="relative">
            <label htmlFor="year-input" className="block text-sm font-medium text-default-font mb-1">
                {label}
            </label>
            <input
                type="number"
                id="year-input"
                value={value}
                onChange={handleChange}
                min="1500"
                max="2100"
                className="block w-full appearance-none px-4 py-2 text-default-font bg-default-background border rounded-md shadow-sm border-brand-primary pl-9 pr-3 placeholder:text-default-font/50 transition ease-in-out hover:bg-brand-400/10 focus:bg-brand-400/10 focus:outline-none duration-200 sm:text-sm resize-none hover:resize-y sm:w-full"
                placeholder="YYYY"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    {/* <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /> */}
                </svg>
            </div>
        </div>
    );
};

export default YearInput;
