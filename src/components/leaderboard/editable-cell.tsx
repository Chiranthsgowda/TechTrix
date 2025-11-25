"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type EditableCellProps = {
  value: number | null;
  onSave: (newValue: number | null) => void;
  isEditing: boolean;
};

export function EditableCell({ value, onSave, isEditing }: EditableCellProps) {
  const [currentValue, setCurrentValue] = useState(String(value ?? ''));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && isFocused) {
      inputRef.current?.focus();
    }
  }, [isEditing, isFocused]);

  const handleSave = () => {
    const numValue = currentValue.trim() === '' ? null : Number(currentValue);
    if (numValue !== value) {
      onSave(numValue);
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setCurrentValue(String(value ?? ''));
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  if (!isEditing) {
    return <span className="px-3 py-2">{value ?? '–'}</span>;
  }

  return (
    <div className="relative" onClick={() => setIsFocused(true)}>
      {isFocused ? (
        <Input
          ref={inputRef}
          type="number"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 p-1 text-center bg-background"
        />
      ) : (
        <div className={cn("px-3 py-2 text-center rounded-md hover:bg-muted cursor-pointer", value === null && "text-muted-foreground")}>
          {value ?? '–'}
        </div>
      )}
    </div>
  );
}
