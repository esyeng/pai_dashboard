"use client";

import React, { useState } from 'react';
import MonthSelect from './ui/MonthSelect';
import YearInput from './ui/YearInput';
import { useChat } from '@/contexts/ChatContext';

const DateSelector: React.FC = () => {
    const { month, year, setMonth, setYear } = useChat();

    return (
        <div className="space-y-4">
            <MonthSelect
                label="Select Month (Optional)"
                value={month}
                onChange={(newMonth) => setMonth(newMonth)}
            />
            <YearInput
                label="Enter Year (Optional)"
                value={year}
                onChange={(newYear) => setYear(newYear)}
            />
            <p className="mt-4 text-sm text-gray-600">
                Selected Date: {month}/{year}
            </p>
        </div>
    );
};

export default DateSelector;
