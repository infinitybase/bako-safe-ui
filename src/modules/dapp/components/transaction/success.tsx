import { Button, Text } from 'bako-ui';
import { useCallback } from 'react';

import { Container } from '@/layouts/dapp/container';
import { FixedFooter } from '@/layouts/dapp/fixed-footer';
import { ScrollableContent } from '@/layouts/dapp/scrollable-content';
import { CheckIcon } from '@/components';

interface DappTransactionSuccessProps {
  title: string;
  description: string;
}

const DappTransactionSuccess = (props: DappTransactionSuccessProps) => {
  const { title, description } = props;

  const origin = window.location.origin;

  const handleRedirectToBakoSafe = useCallback(() => {
    window.close();
    window.open(origin, '_BLANK');
  }, [origin]);

  return (
    <Container>
      <ScrollableContent justify="center">
        <CheckIcon boxSize={12} color="gray.50" />
        <Text
          fontWeight={700}
          fontSize="md"
          color="gray.50"
        >
          {title}
        </Text>
        <Text
          color="gray.400"
          fontSize="sm"
          fontWeight={500}
          lineHeight="140%"
          textAlign="center"
        >
          {description}
        </Text>
      </ScrollableContent>
      <FixedFooter bg="none">
        <Button
          variant="subtle"
          color="gray.300"
          bgColor="gray.600"
          px="20px"
          w="full"
          fontWeight={400}
          onClick={() => handleRedirectToBakoSafe()}
        >
          Go to Bako Safe
        </Button>
      </FixedFooter>
    </Container>
  );
};

export { DappTransactionSuccess };
