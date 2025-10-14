import { Box, BoxProps, Button, Card, Heading, Text, VStack } from 'bako-ui';

import { EmptyBoxOutline } from '@/components';

interface EmptyStateProps extends BoxProps {
  isDisabled?: boolean;
  buttonAction?: () => void;
  showAction?: boolean;
  title?: string;
  subTitle?: string;
  buttonActionTitle?: string;
}

// TODO: refactor to use EmptyState component from bako-ui
const EmptyState = ({
  isDisabled,
  buttonAction,
  showAction = true,
  title,
  subTitle,
  buttonActionTitle,
  ...rest
}: EmptyStateProps) => {
  return (
    <Card.Root
      w="full"
      p={{ base: 10, sm: 10 }}
      bg="gradients.transaction-card"
      borderWidth={1}
      borderColor="gradients.transaction-border"
      backdropFilter="blur(16px)"
      dropShadow="0px 8px 6px 0px #00000026"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      {...rest}
    >
      <VStack gap={0}>
        <Box mb={5} filter="grayscale(100%)" opacity={0.5}>
          <EmptyBoxOutline w={100} h={100} />
        </Box>
        <VStack gap={3}>
          <Heading color="grey.75" fontSize="xl" textAlign="center">
            {title ?? 'Nothing to show here.'}
          </Heading>
          <Text
            color="grey.250"
            textAlign="center"
            fontWeight={400}
            // variant="description"
          >
            {subTitle ?? `It seems like you haven't made any transactions yet.`}
          </Text>
        </VStack>
        {showAction && (
          <Button
            mt={10}
            colorPalette="emptyState"
            disabled={isDisabled}
            onClick={buttonAction}
            w="full"
          >
            {buttonActionTitle ?? 'Create transaction'}
          </Button>
        )}
      </VStack>
    </Card.Root>
  );
};
export { EmptyState };
