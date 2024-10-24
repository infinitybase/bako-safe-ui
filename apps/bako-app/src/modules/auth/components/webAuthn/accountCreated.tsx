import { Text, VStack } from '@chakra-ui/react';
import { ProgressButton } from '@ui/components';

import { UseDappSignIn, UseWebSignIn } from '../../hooks';
import { SignInHeader } from '../header';

interface WebAuthnAccountCreatedProps {
  title: string;
  formState: UseWebSignIn['formState'] | UseDappSignIn['formState'];
  showDescription: boolean;
}

const WebAuthnAccountCreated = (props: WebAuthnAccountCreatedProps) => {
  const { title, formState, showDescription } = props;

  return (
    <VStack h="full" spacing={8} justifyContent="center">
      <VStack spacing={0}>
        <SignInHeader title={title} showDescription={showDescription} />

        <Text fontSize="xs" color="grey.250">
          Account created!
        </Text>
      </VStack>

      <ProgressButton
        w="full"
        maxW={{ base: 292, md: 390 }}
        variant="primary"
        fontSize="sm"
        onClick={formState.handleAction}
        _hover={{
          opacity: formState.isDisabled && 0.8,
        }}
        isDisabled={formState.isDisabled}
        progress={formState.actionProgress}
      >
        {formState.label}
      </ProgressButton>
    </VStack>
  );
};

export { WebAuthnAccountCreated };
