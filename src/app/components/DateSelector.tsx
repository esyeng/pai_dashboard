"use client";

import React, { useState } from 'react';
import MonthSelect from './ui/MonthSelect';
import YearInput from './ui/YearInput';
import { useSearch } from '@/contexts/SearchContext';

const DateSelector: React.FC = () => {
    const { month, year, setMonth, setYear } = useSearch();

    return (
        <div className="space-y-4 w-full">
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
            <p className="mt-4 text-sm text-brand-primary">
                Selected Date: {month}/{year}
            </p>
        </div>
    );
};

export default DateSelector;
