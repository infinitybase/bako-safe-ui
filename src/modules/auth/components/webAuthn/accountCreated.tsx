import { Text, VStack } from '@chakra-ui/react';

import { ProgressButton } from '@/components/progressButton';

import { UseWebAuthnSignIn } from '../../hooks';
import { SignInHeader } from '../header';

interface WebAuthnAccountCreatedProps {
  title: string;
  formState: UseWebAuthnSignIn['formState'];
}

const WebAuthnAccountCreated = (props: WebAuthnAccountCreatedProps) => {
  const { title, formState } = props;

  return (
    <VStack h="full" spacing={8} justifyContent="center">
      <VStack spacing={0}>
        <SignInHeader title={title} />

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
