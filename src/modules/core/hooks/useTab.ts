import { useState } from 'react';

export interface UseTabOptions<T extends number> {
  defaultTab: T;
  tabs: T[];
}

const useTab = <T extends number>({ tabs, defaultTab }: UseTabOptions<T>) => {
  const [tab, setTab] = useState<T>(defaultTab);

  const is = (value: T) => value === tab;

  const length = tabs.length;

  return {
    tab,
    is,
    set: setTab,
    length,
  };
};

export { useTab };
