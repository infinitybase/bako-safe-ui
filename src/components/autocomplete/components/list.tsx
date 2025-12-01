import { Box, Flex, VStack } from 'bako-ui';
import React, {
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
      if (!anchorRef?.current) return;

      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + ANCHOR_OFFSET,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }, [anchorRef]);

    useEffect(() => {
      updatePosition();

      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      const resizeObserver = new ResizeObserver(updatePosition);
      if (anchorRef.current) {
        resizeObserver.observe(anchorRef.current);
      }

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        resizeObserver.disconnect();
      };
    }, [anchorRef, updatePosition]);

    return (
      <Box
        bg="bg.panel"
        ref={rootRef}
        color="textPrimary"
        fontSize="md"
        borderRadius="l1"
        padding={1 / 2}
        position="fixed"
        zIndex={400}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
      >
        <Flex display="flex" justifyContent="center" alignItems="center">
          <VStack
            w="full"
            maxH={194}
            gap={0}
            overflowY="scroll"
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
