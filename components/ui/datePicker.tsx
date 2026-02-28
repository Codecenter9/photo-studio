"use client";

import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function SmallDatePicker() {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Select date"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                slotProps={{
                    textField: {
                        size: "small",   
                        fullWidth: true,
                    },
                }}
            />
        </LocalizationProvider>
    );
}