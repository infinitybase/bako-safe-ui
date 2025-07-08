import { Box } from '@chakra-ui/react';
import { useEffect, useMemo, useRef } from 'react';

interface InputMirrorProps<T extends string | number = string> {
  inputRef: React.RefObject<HTMLInputElement>;
  value?: T;
}

export const InputMirror = <T extends string | number = string>({
  inputRef,
  value,
}: InputMirrorProps<T>) => {
  const mirrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      const mirrorWidth = mirrorRef.current.offsetWidth;
      // eslint-disable-next-line react-compiler/react-compiler
      inputRef.current.style.width = `${mirrorWidth}px`;
    }
  }, [value]);

  const isEmptyValue = useMemo(() => value === '0' || !value, [value]);

  return (
    <Box
      ref={mirrorRef}
      position="absolute"
      visibility="hidden"
      fontSize="3xl"
      whiteSpace="pre"
      // prevent decimals from breaking the layout
      px={isEmptyValue ? 6 : 2}
    >
      {value}
    </Box>
  );
};
