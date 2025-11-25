"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Team } from '@/types/team';
import { Crown, Medal } from 'lucide-react';
import { EditableCell } from './editable-cell';

type LeaderboardTableProps = {
  teams: Team[];
  isAdmin: boolean;
  onScoreUpdate: (teamId: string, field: keyof Team, value: number | null) => void;
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-yellow-600" />;
  return rank;
};

export function LeaderboardTable({ teams, isAdmin, onScoreUpdate }: LeaderboardTableProps) {
  return (
    <div className="border border-primary/20 rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-primary/40 hover:bg-transparent">
              <TableHead className="w-[80px] text-center text-primary font-bold">Rank</TableHead>
              <TableHead className="min-w-[200px] text-accent font-bold">Team Name</TableHead>
              <TableHead className="min-w-[200px] text-accent font-bold">College Name</TableHead>
              <TableHead className="w-[120px] text-center text-accent font-bold">Round 1</TableHead>
              <TableHead className="w-[120px] text-center text-accent font-bold">Round 2</TableHead>
              <TableHead className="w-[120px] text-center text-accent font-bold">Round 3</TableHead>
              {isAdmin && <TableHead className="w-[120px] text-center text-accent font-bold">Manual Rank</TableHead>}
              <TableHead className="w-[120px] text-center text-primary font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team, index) => {
              const rank = index + 1;
              return (
                <TableRow key={team.id} className="border-primary/10">
                  <TableCell className="text-center font-bold text-lg">
                    <div className="flex items-center justify-center gap-2">
                        {getRankIcon(rank)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{team.teamName}</TableCell>
                  <TableCell className="text-muted-foreground">{team.collegeName}</TableCell>
                  <TableCell className="text-center">
                    {isAdmin ? (
                      <EditableCell isEditing={isAdmin} value={team.round1} onSave={(val) => onScoreUpdate(team.id, 'round1', val)} />
                    ) : (
                      team.round1
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isAdmin ? (
                      <EditableCell isEditing={isAdmin} value={team.round2} onSave={(val) => onScoreUpdate(team.id, 'round2', val)} />
                    ) : (
                      team.round2
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isAdmin ? (
                      <EditableCell isEditing={isAdmin} value={team.round3} onSave={(val) => onScoreUpdate(team.id, 'round3', val)} />
                    ) : (
                      team.round3
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-center">
                      <EditableCell isEditing={isAdmin} value={team.manualRank} onSave={(val) => onScoreUpdate(team.id, 'manualRank', val)} />
                    </TableCell>
                  )}
                  <TableCell className="text-center font-bold text-lg text-primary">{team.total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {teams.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No teams have been added yet.</p>
          {isAdmin && <p className="mt-2">Use the admin panel to add the first team.</p>}
        </div>
      )}
    </div>
  );
}
