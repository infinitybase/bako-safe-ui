import { Button, Card, Heading, Text, VStack } from 'bako-ui';

import { UseDappSignIn, UseWebSignIn } from '../../hooks';

interface WebAuthnAccountCreatedProps {
  formState: UseWebSignIn['formState'] | UseDappSignIn['formState'];
  username: string;
}

const WebAuthnAccountCreated = (props: WebAuthnAccountCreatedProps) => {
  const { formState, username } = props;

  return (
    <Card.Root variant="subtle" bg="gray.700" rounded="2xl" w="full" h="250px">
      <Card.Header />
      <Card.Body flex={1} display="flex" justifyContent="center" pb={0}>
        <VStack
          h="full"
          w="full"
          gap={8}
          alignItems="start"
          justifyContent="flex-end"
        >
          <VStack gap={2} alignItems="start">
            <Heading fontSize="3xl" color="textPrimary">
              Account created!
            </Heading>
            <Text color="textSecondary" fontSize="sm">
              {username}
            </Text>
          </VStack>

          <Button
            alignSelf="flex-start"
            fontSize="sm"
            aria-label={formState.label}
            onClick={formState.handleAction}
            _hover={{
              opacity: formState.isDisabled ? 0.8 : 1,
            }}
            disabled={formState.isDisabled}
          >
            {formState.label}
          </Button>
        </VStack>
      </Card.Body>
      <Card.Footer />
    </Card.Root>
  );
};

export { WebAuthnAccountCreated };
