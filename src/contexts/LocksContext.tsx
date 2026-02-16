import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lock } from '@/lib/locks';

interface LocksState {
  locks: Lock[];
  addLock: (lock: Omit<Lock, 'id' | 'completed' | 'withdrawn' | 'createdAt'>) => Lock;
  completeLock: (id: number) => void;
  withdrawLock: (id: number) => void;
}

const LocksContext = createContext<LocksState>({
  locks: [],
  addLock: () => ({ id: 0, owner: '', goal: '', amount: 0, deadline: new Date(), completed: false, withdrawn: false, createdAt: new Date() }),
  completeLock: () => {},
  withdrawLock: () => {},
});

export const useLocks = () => useContext(LocksContext);

export const LocksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locks, setLocks] = useState<Lock[]>([]);
  const [nextId, setNextId] = useState(1);

  const addLock = useCallback((data: Omit<Lock, 'id' | 'completed' | 'withdrawn' | 'createdAt'>) => {
    const lock: Lock = {
      ...data,
      id: nextId,
      completed: false,
      withdrawn: false,
      createdAt: new Date(),
    };
    setLocks(prev => [...prev, lock]);
    setNextId(prev => prev + 1);
    return lock;
  }, [nextId]);

  const completeLock = useCallback((id: number) => {
    setLocks(prev => prev.map(l => l.id === id ? { ...l, completed: true } : l));
  }, []);

  const withdrawLock = useCallback((id: number) => {
    setLocks(prev => prev.map(l => l.id === id ? { ...l, withdrawn: true } : l));
  }, []);

  return (
    <LocksContext.Provider value={{ locks, addLock, completeLock, withdrawLock }}>
      {children}
    </LocksContext.Provider>
  );
};
