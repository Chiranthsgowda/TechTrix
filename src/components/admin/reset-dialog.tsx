"use client";

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CONFIRMATION_TEXT = 'TECHTRIX';

type ResetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
};

export function ResetDialog({ open, onOpenChange, onConfirm }: ResetDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const isMatch = inputValue === CONFIRMATION_TEXT;

  useEffect(() => {
    if (open) {
      setInputValue('');
      setIsConfirming(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!isMatch) return;
    setIsConfirming(true);
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive text-2xl">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all teams and their scores from the leaderboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Label htmlFor="confirmation">
            To confirm, please type <strong className="text-foreground">{CONFIRMATION_TEXT}</strong> into the box below.
          </Label>
          <Input
            id="confirmation"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isMatch || isConfirming}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isConfirming ? 'Deleting...' : 'I understand, delete everything'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
