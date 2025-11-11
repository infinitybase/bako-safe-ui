import { Card, Heading, Progress, Text } from 'bako-ui';

interface LoadingCardProps {
  title?: string;
  subtitle?: string;
}

export const LoadingCard = ({ title, subtitle }: LoadingCardProps) => {
  return (
    <Card.Root
      w="full"
      variant="subtle"
      bg="gray.700"
      rounded="2xl"
      height="250px"
    >
      <Card.Header>
        <Progress
          value={null}
          w="full"
          colorPalette="white"
          variant="subtle"
          size="xs"
          trackProps={{
            bg: 'yellow.100',
          }}
          rangeProps={{
            bg: 'white',
          }}
        />
      </Card.Header>
      <Card.Body flex={1} justifyContent="center">
        <Heading color="textPrimary" fontSize="3xl">
          {title}
        </Heading>
      </Card.Body>
      <Card.Footer>
        <Text color="textSecondary" fontSize="sm">
          {subtitle}
        </Text>
      </Card.Footer>
    </Card.Root>
  );
};
