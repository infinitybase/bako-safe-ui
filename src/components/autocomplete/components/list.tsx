import { Box, Flex, VStack } from 'bako-ui';
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
}

interface Position {
  top: number;
  left: number;
  width: number;
}

const ANCHOR_OFFSET = 8;

const AutocompleteOptionList = memo(
  ({ children, rootRef, anchorRef }: AutocompleteOptionListProps) => {
    const [position, setPosition] = useState<Position>({
      top: 0,
      left: 0,
      width: 0,
    });

    const updatePosition = useCallback(() => {
      if (!anchorRef.current) return;

      const anchor = anchorRef.current;

      const container = anchor.offsetParent as HTMLElement;
      if (!container) return;

      const anchorRect = anchor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setPosition({
        top: anchorRect.bottom - containerRect.top + ANCHOR_OFFSET,
        left: anchorRect.left - containerRect.left,
        width: anchorRect.width,
      });
    }, [anchorRef]);

    useEffect(() => {
      const el = anchorRef.current;
      if (!el) return;

      updatePosition();

      const resizeObserver = new ResizeObserver(updatePosition);
      resizeObserver.observe(el);

      // observe scroll do container do modal, não da janela
      const scrollContainer = el.offsetParent;
      scrollContainer?.addEventListener('scroll', updatePosition, {
        passive: true,
      });

      window.addEventListener('resize', updatePosition);

      return () => {
        resizeObserver.disconnect();
        scrollContainer?.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }, [anchorRef, updatePosition]);

    return (
      <Box
        ref={rootRef}
        bg="bg.panel"
        color="textPrimary"
        fontSize="md"
        borderRadius="sm"
        padding={1 / 2}
        position="absolute"
        zIndex={400}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
      >
        <Flex justifyContent="center" alignItems="center">
          <VStack
            w="full"
            maxH={178}
            gap={0}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': { width: '0' },
              scrollbarWidth: 'none',
            }}
          >
            {children}
          </VStack>
        </Flex>
      </Box>
    );
  },
);

AutocompleteOptionList.displayName = 'AutocompleteOptionList';

export default AutocompleteOptionList;
