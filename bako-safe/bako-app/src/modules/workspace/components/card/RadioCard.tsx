import { Box, RadioProps, useRadio } from '@chakra-ui/react';

const RadioCard = ({ children, ...props }: RadioProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" {...props}>
      <input {...input} />
      <Box {...checkbox} borderRadius="lg">
        {children}
      </Box>
    </Box>
  );
};

export { RadioCard };
