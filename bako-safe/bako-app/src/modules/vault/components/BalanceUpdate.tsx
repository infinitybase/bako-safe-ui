import { keyframes, Text, TextProps } from '@chakra-ui/react';
import { RefreshIcon } from '@ui/components';

const Update = (props: TextProps & { isLoading: boolean }) => {
  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  return (
    <Text
      w={20}
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      variant="description"
      fontSize={{ base: 'small', sm: 'md' }}
      fontWeight="semibold"
      _hover={{
        cursor: 'pointer',
        color: 'grey.200',
      }}
      {...props}
    >
      Update
      <RefreshIcon
        _hover={{
          cursor: 'pointer',
          color: 'grey.200',
        }}
        w={{ base: 4, sm: 5 }}
        h={{ base: 4, sm: 5 }}
        animation={props.isLoading ? `${spin} 1s linear infinite` : undefined}
      />
    </Text>
  );
};

export { Update };
