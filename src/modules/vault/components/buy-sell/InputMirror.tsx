import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

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

  return (
    <Box
      ref={mirrorRef}
      position="absolute"
      visibility="hidden"
      fontSize="3xl"
      whiteSpace="pre"
      // prevent decimals from breaking the layout
      px={6}
    >
      {value}
    </Box>
  );
};
