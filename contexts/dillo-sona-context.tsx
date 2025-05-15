import React, { ReactNode, createContext, useContext, useState } from 'react';

type CardKey = 'moon' | 'sun' | 'chariot' | 'lovers' | 'fool';

interface TallyContextValue {
  tally: Record<CardKey, number>;
  add: (card: CardKey, amount?: number) => void;
}

const initial: Record<CardKey, number> = {
  moon: 0,
  sun: 0,
  chariot: 0,
  lovers: 0,
  fool: 0,
};

const DilloSonaContext = createContext<TallyContextValue | null>(null);

export function DilloSonaProvider({ children }: { children: ReactNode }) {
  const [tally, setTally] = useState<Record<CardKey, number>>(initial);

  function add(card: CardKey, amount = 1) {
    setTally((t) => ({ ...t, [card]: t[card] + amount }));
  }

  return (
    <DilloSonaContext.Provider value={{ tally, add }}>
      {children}
    </DilloSonaContext.Provider>
  );
}

export function useDilloSona() {
  const ctx = useContext(DilloSonaContext);
  if (!ctx) throw new Error('useDilloSona must be inside DilloSonaProvider');
  return ctx;
}
