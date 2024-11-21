"use client";

import React from 'react';

interface MonthSelectProps {
    label: string;
    value: number;
    onChange: (month: number) => void;
}

const MonthSelect: React.FC<MonthSelectProps> = ({ label, value, onChange }) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="relative">
            <label htmlFor="month-select" className="block text-sm font-medium text-[#85d7de]  mb-1">
                {label}
            </label>
            <select
                id="month-select"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="block w-full px-4 py-2 pr-8 text-[#85d7de] bg-caribbean-current border  rounded-md shadow-sm appearance-none border-slate-300 pl-9 placeholder:text-[#85d7de] transition ease-in-out hover:bg-mint/10 focus:bg-mint/10 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#5bdde8] duration-200  resize-none hover:resize-y sm:w-full sm:text-sm"
            >
                {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                        {month}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

export default MonthSelect;
