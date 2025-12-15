import {
  autoUpdate,
  flip,
  hide,
  offset,
  size,
  useFloating,
} from '@floating-ui/react';
import { Box, VStack } from 'bako-ui';
import {
  LegacyRef,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';

interface AutocompleteOptionListProps {
  children: React.ReactNode;
  rootRef?: LegacyRef<HTMLDivElement>;
  anchorRef: RefObject<HTMLDivElement | null>;
  boundaryRef?: RefObject<HTMLDivElement | null>;
}

const ANCHOR_OFFSET = 8;
const MAX_HEIGHT = 182;

const AutocompleteOptionList = memo(
  ({
    children,
    anchorRef,
    boundaryRef,
    rootRef,
  }: AutocompleteOptionListProps) => {
    const [isReferenceVisible, setIsReferenceVisible] = useState(true);

    const boundaryEl = boundaryRef?.current ?? undefined;

    const { refs, floatingStyles, update } = useFloating({
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [
        offset(ANCHOR_OFFSET),
        flip({ boundary: boundaryEl }),
        hide({
          strategy: 'referenceHidden',
          boundary: boundaryEl,
        }),
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `${MAX_HEIGHT}px`,
            });
          },
        }),
      ],
    });

    // rootRef (LegacyRef) + floatingRef
    const setFloating = useCallback(
      (node: HTMLDivElement | null) => {
        refs.setFloating(node);

        if (typeof rootRef === 'function') {
          rootRef(node);
        } else if (rootRef && 'current' in rootRef) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (rootRef as any).current = node;
        }
      },
      [refs, rootRef],
    );

    useEffect(() => {
      if (anchorRef.current) refs.setReference(anchorRef.current);
    }, [anchorRef, refs]);

    useEffect(() => {
      const reference = anchorRef.current;
      const floating = refs.floating.current;
      if (!reference || !floating) return;

      return autoUpdate(reference, floating, update, {
        ancestorScroll: true,
        ancestorResize: true,
      });
    }, [anchorRef, refs, update]);

    useEffect(() => {
      const reference = anchorRef.current;
      if (!reference) return;

      const root = boundaryRef?.current ?? null; // null -> viewport

      const observer = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          const visible = !!e && e.isIntersecting;
          setIsReferenceVisible(visible);
        },
        {
          root,
          threshold: 0,
        },
      );

      observer.observe(reference);

      return () => {
        observer.disconnect();
      };
    }, [anchorRef, boundaryRef]);

    if (!isReferenceVisible) {
      return null;
    }

    return (
      <Box
        ref={setFloating}
        style={{
          ...floatingStyles,
        }}
        bg="bg.panel"
        color="textPrimary"
        borderRadius="sm"
        padding={1 / 2}
        zIndex={400}
        overflow="hidden"
      >
        <VStack
          w="full"
          gap={0}
          maxH={MAX_HEIGHT}
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { width: '0' },
            scrollbarWidth: 'none',
          }}
        >
          {children}
        </VStack>
      </Box>
    );
  },
);

AutocompleteOptionList.displayName = 'AutocompleteOptionList';

export default AutocompleteOptionList;
