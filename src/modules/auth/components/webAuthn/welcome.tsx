import { Card, Heading, Text, VStack } from 'bako-ui';

interface WebAuthnAccountCreatedProps {
  username: string;
}

const WebAuthnWelcome = (props: WebAuthnAccountCreatedProps) => {
  const { username } = props;

  return (
    <Card.Root
      variant="subtle"
      bg="gray.700"
      rounded="2xl"
      w="full"
      h="250px"
      p={6}
    >
      <Card.Body
        flex={1}
        display="flex"
        justifyContent="center"
        p={0}
        position="relative"
      >
        <Text
          color="textSecondary"
          fontSize="sm"
          w="full"
          position="absolute"
          top={0}
          left={0}
        >
          Welcome
        </Text>
        <VStack w="full" flex={1} alignItems="start" justifyContent="center">
          <Heading
            fontSize="2rem"
            fontWeight="bold"
            color="textPrimary"
            w="full"
            truncate
          >
            {username}
          </Heading>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export { WebAuthnWelcome };
