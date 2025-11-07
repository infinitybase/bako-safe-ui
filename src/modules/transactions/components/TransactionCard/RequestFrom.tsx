import { Alert, Card, HStack, Stack, StackProps, Text, VStack } from 'bako-ui';
import React, { memo } from 'react';

import { MinimalAlertIcon } from '@/components';
import { Nullable } from '@/modules/core';

interface TransactionRequestFromProps extends StackProps {
  name: Nullable<string>;
  origin: Nullable<string>;
  icon?: React.ReactNode;
}

const TransactionRequestFrom = memo((props: TransactionRequestFromProps) => {
  const { name, origin, icon, ...rest } = props;

  return (
    <Stack gap={4} {...rest}>
      <Text fontSize="xs" color="gray.400" fontWeight="medium">
        Requesting a transaction from:
      </Text>
      <Card.Root variant="subtle" borderRadius="lg" w="full">
        <Card.Body p={4}>
          <HStack
            width="100%"
            gap={3.5}
            alignItems={{ base: 'flex-start', sm: 'center' }}
            flexDirection={{ base: 'column', sm: 'row' }}
          >
            <HStack alignItems="center" gap={3.5} flexShrink={0}>
              {icon && icon}
              <VStack alignItems="flex-start" gap={2}>
                <Text
                  color="gray.200"
                  fontSize="xs"
                  fontWeight="medium"
                  lineHeight="shorter"
                  truncate
                >
                  {name}
                </Text>
                <Text
                  color="gray.400"
                  fontSize="xs"
                  lineHeight="shorter"
                  truncate
                >
                  {origin}
                </Text>
              </VStack>
            </HStack>

            <Alert.Root
              colorPalette="yellow"
              variant="subtle"
              bg="primary.main/5"
              color="primary.main"
              p={3}
              rounded="sm"
            >
              <Alert.Indicator alignSelf="center">
                <MinimalAlertIcon />
              </Alert.Indicator>
              <Alert.Content>
                <Alert.Description>
                  Please carefully review this externally created transaction
                  before approving it.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          </HStack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
});

TransactionRequestFrom.displayName = 'TransactionRequestFrom';

export { TransactionRequestFrom };
