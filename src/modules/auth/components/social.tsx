import { Button, HStack, Icon, Stack, Text } from 'bako-ui';

import { GoogleIcon } from '@/components';

interface SocialSignInProps {
  hidden?: boolean;
  unableToConnect: boolean;
  onConnect: () => void;
}

const SocialSignIn = (props: SocialSignInProps) => {
  const { hidden, unableToConnect, onConnect } = props;

  return (
    <Stack hidden={hidden} w="full">
      <Button
        variant="subtle"
        bg="bg.panel"
        color="textSecondary"
        _hover={{
          bg: 'bg.muted',
          color: 'textPrimary',
        }}
        w="full"
        onClick={onConnect}
        disabled={unableToConnect}
      >
        <HStack w="full">
          <Icon as={GoogleIcon} boxSize={4} />
          <Text flex={1}>Login with Google or E-mail</Text>
        </HStack>
      </Button>
    </Stack>
  );
};

export { SocialSignIn };
