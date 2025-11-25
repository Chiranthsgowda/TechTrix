"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { collection, onSnapshot, query, doc, updateDoc, addDoc, serverTimestamp, writeBatch, getDocs, deleteDoc, orderBy as firestoreOrderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth';
import type { Team } from '@/types/team';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { AdminPanel } from '@/components/admin/admin-panel';
import { LoginModal } from '@/components/admin/login-modal';
import { ResetDialog } from '@/components/admin/reset-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn, LogOut, UserCog, LoaderCircle, AlertTriangle } from 'lucide-react';

export function LeaderboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { toast } = useToast();
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (auth && firestore) {
      setFirebaseReady(true);
    }
  }, []);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const teamsCollection = collection(firestore, 'teams');
    const q = query(teamsCollection);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const teamsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Team));
      setTeams(teamsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching teams: ", error);
      toast({
        title: "Error",
        description: "Could not fetch leaderboard data.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast, firebaseReady]);

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      const aRank = a.manualRank ?? Infinity;
      const bRank = b.manualRank ?? Infinity;
      if (aRank !== bRank) {
        return aRank - bRank;
      }
      if (a.createdAt && b.createdAt) {
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      }
      return 0;
    });
  }, [teams]);

  const handleLogin = useCallback(async (email, password) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: 'Welcome, admin!',
      });
      setLoginModalOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: 'Login Failed',
        description: 'Please check your email and password.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const handleLogout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  }, [toast]);

  const handleAddTeam = useCallback(async (teamName: string, collegeName: string) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'teams'), {
        teamName,
        collegeName,
        round1: 0,
        round2: 0,
        round3: 0,
        total: 0,
        manualRank: null,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Team Added',
        description: `${teamName} has been added to the leaderboard.`,
      });
    } catch (error) {
      console.error("Error adding team: ", error);
      toast({
        title: 'Error',
        description: 'Could not add the team.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleScoreUpdate = useCallback(async (teamId: string, field: keyof Team, value: number | null) => {
    if (!firestore) return;
    const teamDocRef = doc(firestore, 'teams', teamId);
    try {
      const teamToUpdate = teams.find(t => t.id === teamId);
      if (!teamToUpdate) return;
      
      const updatedData: Partial<Team> = { [field]: value };

      if (['round1', 'round2', 'round3'].includes(field as string)) {
        const r1 = field === 'round1' ? (value ?? 0) : teamToUpdate.round1;
        const r2 = field === 'round2' ? (value ?? 0) : teamToUpdate.round2;
        const r3 = field === 'round3' ? (value ?? 0) : teamToUpdate.round3;
        updatedData.total = r1 + r2 + r3;
      }

      await updateDoc(teamDocRef, updatedData);
    } catch (error) {
      console.error("Error updating score: ", error);
      toast({
        title: 'Update Failed',
        description: 'Could not update the score.',
        variant: 'destructive',
      });
    }
  }, [teams, toast]);
  
  const handleReset = useCallback(async () => {
    if (!firestore) return;
    try {
      const teamsCollection = collection(firestore, 'teams');
      const querySnapshot = await getDocs(teamsCollection);
      const batch = writeBatch(firestore);
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      toast({
        title: 'Event Reset',
        description: 'All teams have been deleted.',
      });
    } catch (error) {
      console.error("Error resetting event: ", error);
      toast({
        title: 'Error',
        description: 'Could not reset the event.',
        variant: 'destructive',
      });
    }
  }, [toast]);


  if (!firebaseReady && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-96 bg-card border border-destructive/50 rounded-lg p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-destructive mb-2">Firebase Not Configured</h2>
            <p className="text-muted-foreground max-w-md">
                The application cannot connect to Firebase. Please ensure your <code>.env.local</code> file is present and contains the correct Firebase project configuration. The app will not function correctly without it.
            </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            TechTrix
          </h1>
          {authLoading ? (
            <div className="h-10 w-24 bg-muted/50 rounded-md animate-pulse"></div>
          ) : (
            <div className="flex items-center gap-2">
              {isAdmin && user ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, Admin</span>
                  <Button variant="ghost" onClick={handleLogout} className="hover:bg-accent/20 hover:text-accent">
                    <LogOut className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Button onClick={() => setLoginModalOpen(true)} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground shadow-sm shadow-accent/50 hover:shadow-md hover:shadow-accent/50">
                  <UserCog className="mr-2 h-4 w-4" /> Admin Login
                </Button>
              )}
            </div>
          )}
        </header>

        <main>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-200 via-primary to-accent">
              TechTrix Leaderboard
            </h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Journey through code, clues, and creativity.
            </p>
          </div>

          {isAdmin && (
            <AdminPanel onAddTeam={handleAddTeam} onReset={() => setResetDialogOpen(true)} />
          )}

          {loading ? (
             <div className="flex justify-center items-center h-64">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
             </div>
          ) : (
            <LeaderboardTable teams={sortedTeams} isAdmin={isAdmin} onScoreUpdate={handleScoreUpdate} />
          )}
        </main>
      </div>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} onLogin={handleLogin} />
      {isAdmin && <ResetDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen} onConfirm={handleReset} />}
    </>
  );
}
