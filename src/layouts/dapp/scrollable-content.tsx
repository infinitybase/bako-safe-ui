import { CustomSkeleton } from '@/components';
import { Box, VStack, VStackProps } from 'bako-ui';

interface Props extends VStackProps {
  isLoading?: boolean,
}

const ScrollableContent = ({
  isLoading = false,
  children,
  ...rest
}: Props) => {
  if (isLoading)
    return (
      <Box w="full" p={6} flex={1}>
        <CustomSkeleton loading={isLoading} h="full" />
      </Box>
    );

  return (
    <VStack
      flex={1}
      overflowY="auto"
      w="full"
      p={6}
      gap={6}
      css={{
        '&::-webkit-scrollbar': { width: '0' },
        scrollbarWidth: 'none',
      }}
      {...rest}
    >
      {children}
    </VStack>
  );
};

export { ScrollableContent };
