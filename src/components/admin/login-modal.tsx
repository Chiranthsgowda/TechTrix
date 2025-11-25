"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, password: string) => Promise<void>;
};

export function LoginModal({ open, onOpenChange, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await onLogin(email, password);
      onOpenChange(false);
    } catch (err: any) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-primary/30 shadow-lg shadow-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary">Admin Login</DialogTitle>
          <DialogDescription>Enter your credentials to access the admin panel.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full mt-2 shadow-md shadow-primary/40 hover:shadow-lg hover:shadow-primary/40">
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
