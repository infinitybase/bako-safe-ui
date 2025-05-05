import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ObservedEntry {
  id: string;
  isIntersecting: boolean;
}

type IntersectionObserverHookOptions = {
  options?: IntersectionObserverInit;
};

export function useIntersectionObserver({
  options,
}: IntersectionObserverHookOptions = {}) {
  const observerInstance = useRef<IntersectionObserver>();
  const elements = useRef<Map<string, HTMLElement>>(new Map());
  const [visibleEntries, setVisibleEntries] = useState<ObservedEntry[]>([]);

  useEffect(() => {
    observerInstance.current = new IntersectionObserver((entries) => {
      setVisibleEntries((prev) => {
        const updates = new Map(prev.map((e) => [e.id, e]));

        entries.forEach((entry) => {
          const id =
            entry.target.getAttribute('data-observe-id') || entry.target.id;
          if (!id) return;

          updates.set(id, { id, isIntersecting: entry.isIntersecting });
        });

        return Array.from(updates.values());
      });
    }, options);

    elements.current.forEach((element) => {
      observerInstance.current?.observe(element);
    });

    return () => {
      observerInstance.current?.disconnect();
    };
  }, [options]);

  const observe = useCallback((el: HTMLElement | null, id?: string) => {
    if (el) {
      const elementId = id || el.id || crypto.randomUUID();
      el.setAttribute('data-observe-id', elementId);
      elements.current.set(elementId, el);

      observerInstance.current?.observe(el);
    }
  }, []);

  const refCallback = useCallback(
    (el: HTMLElement | null) => {
      observe(el);
    },
    [observe],
  );

  const visibleIds = useMemo(
    () => visibleEntries.filter((e) => e.isIntersecting).map((e) => e.id),
    [visibleEntries],
  );

  const firstVisibleId = () => visibleIds[0] ?? null;

  return {
    observe,
    refCallback,
    getVisibleIds: () => visibleIds,
    getFirstVisibleId: () => firstVisibleId,
    visibleEntries,
  };
}
