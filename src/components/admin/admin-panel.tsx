"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';

const formSchema = z.object({
  teamName: z.string().min(2, { message: 'Team name must be at least 2 characters.' }),
  collegeName: z.string().min(2, { message: 'College name must be at least 2 characters.' }),
});

type AdminPanelProps = {
  onAddTeam: (teamName: string, collegeName: string) => Promise<void>;
  onReset: () => void;
};

export function AdminPanel({ onAddTeam, onReset }: AdminPanelProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: '',
      collegeName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await onAddTeam(values.teamName, values.collegeName);
    form.reset();
  }

  return (
    <Card className="mb-8 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Admin Controls</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Add New Team</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Code Crusaders" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Institute of Innovation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full md:w-auto shadow-md shadow-primary/40 hover:shadow-lg hover:shadow-primary/40">
                <Plus className="mr-2 h-4 w-4" /> Add Team
              </Button>
            </form>
          </Form>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This action is irreversible. All team data, including names and scores, will be permanently deleted.
          </p>
          <Button variant="destructive" onClick={onReset}>
            <Trash2 className="mr-2 h-4 w-4" /> Reset Event (Delete All Teams)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
