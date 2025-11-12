import { Button, Image, Stack, Text, VStack } from 'bako-ui';

import bakoLogo from '@/assets/bako-logo.svg';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';

interface DappSignInContainerProps {
  message: string;
  disableConnect?: boolean;
  onConnect: (connectorType?: EConnectors) => void | Promise<void>;
}

export const DappSignInContainer = (props: DappSignInContainerProps) => {
  const { message, disableConnect, onConnect } = props;

  return (
    <VStack w="100%" minH="100vh" padding={4} overflow="hidden">
      <Stack flex={1} justifyContent="flex-end">
        <Image width={{ base: 250, sm: 300 }} src={bakoLogo} alt="Bako Logo" />
      </Stack>

      <VStack flex={5} justifyContent="center" alignItems="center" gap={4}>
        <Text textAlign="center" color="gray.100" fontSize="small">
          {message}
        </Text>
        <Button
          aria-label="Connect"
          w="full"
          maxW={{ base: 190, sm: 230 }}
          variant="subtle"
          disabled={disableConnect}
          onClick={() => onConnect()}
        >
          Connect
        </Button>
      </VStack>
    </VStack>
  );
};
