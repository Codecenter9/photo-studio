"use client";

import React from 'react';
import DialogBox from '@/components/ui/modal';
import EthiopianCalendar from "@/components/ui/EthiopianCalendar";
import { CircularProgress } from '@mui/material';

interface ScheduleDialogProps {
  isSubmitting: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value: Date;
  onChange: (date: Date) => void;
  onSave?: (date: Date) => Promise<void>;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  isSubmitting,
  open,
  setOpen,
  title = "Select Date",
  value,
  onChange,
  onSave
}) => {

  const handleSave = async () => {
    if (onSave) {
      await onSave(value);
    }
    setOpen(false);
  };

  return (
    <DialogBox
      open={open}
      title={title}
      onClose={() => setOpen(false)}
      saveLabel={
        isSubmitting ? (
          <span className="flex items-center gap-2">
            <CircularProgress size={15} /> Saving...
          </span>
        ) : (
          "Save"
        )
      }
      onSave={handleSave}
    >
      <div className="p-2">
        <EthiopianCalendar
          value={value}
          onChange={onChange}
        />
      </div>
    </DialogBox>
  );
};

export default ScheduleDialog;