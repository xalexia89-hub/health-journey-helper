import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface DemoContextType {
  isDemo: boolean;
  enableDemo: () => void;
  disableDemo: () => void;
}

const DemoContext = createContext<DemoContextType>({ isDemo: false, enableDemo: () => {}, disableDemo: () => {} });

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const [isDemo, setIsDemo] = useState(() => {
    return localStorage.getItem('medithos_demo') === 'true';
  });

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setIsDemo(true);
      localStorage.setItem('medithos_demo', 'true');
    }
  }, [searchParams]);

  const enableDemo = () => {
    setIsDemo(true);
    localStorage.setItem('medithos_demo', 'true');
  };

  const disableDemo = () => {
    setIsDemo(false);
    localStorage.removeItem('medithos_demo');
  };

  return (
    <DemoContext.Provider value={{ isDemo, enableDemo, disableDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);
