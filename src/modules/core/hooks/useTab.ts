import { useState } from 'react';

import { TabState } from '@/modules';

const useTab = <T extends number>(defaultTab: T) => {
  const [tab, setTab] = useState<T>(defaultTab);

  const is = (value: T) => value === tab;

  const length = Object.keys(TabState).filter((value) =>
    isNaN(Number(value)),
  ).length;

  return {
    tab,
    is,
    set: setTab,
    length,
  };
};

export { useTab };
