import { Avatar, Badge, Box, Heading, HStack, Icon } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';

import { Card } from '@/components';

type ConnectorType = {
  name: string;
  label: string;
  icon?: React.ElementType;
  imageUrl?: string;
  isEnabled?: boolean;
};

interface CardConnectorProps {
  connector: ConnectorType;
  isWebAuthn?: boolean;
  onClick: (connector: string) => void;
}

const CardConnector = (props: CardConnectorProps) => {
  const { connector, isWebAuthn, onClick } = props;

  const ConnectorIcon = useMemo(() => {
    if (connector.imageUrl) {
      return (
        <Avatar
          color="white"
          size="sm"
          bgColor="transparent"
          variant="roundedSquare"
          src={connector.imageUrl}
          name={connector.name}
        />
      );
    }

    if (connector.icon) {
      return <Icon as={connector.icon} fontSize="4xl" />;
    }

    return null;
  }, [connector]);

  const selectConnector = useCallback(() => {
    if (!connector.isEnabled) return;
    onClick(connector.name);
  }, [connector.isEnabled, connector.name, onClick]);

  return (
    <Card
      as={HStack}
      w="100%"
      h="100%"
      gap={4}
      justifyContent="space-between"
      p={2}
      cursor={connector.isEnabled ? 'pointer' : 'initial'}
      bgColor={isWebAuthn ? 'warning.900' : 'dark.50'}
      borderColor={isWebAuthn ? 'brand.500' : 'dark.100'}
      onClick={selectConnector}
      position="relative"
      transition="0.5s"
      _hover={
        isWebAuthn
          ? {
              bg: 'warning.700',
            }
          : {
              borderColor: 'grey.100',
            }
      }
    >
      <Box
        w="full"
        h="full"
        top={0}
        left={0}
        hidden={connector.isEnabled}
        position="absolute"
        borderRadius={10}
        backgroundColor="#121212a8"
      />
      {ConnectorIcon}
      <Box flex={1}>
        <Heading fontSize="sm" fontWeight="semibold" color="grey.200">
          {connector.label}
        </Heading>
      </Box>
      {isWebAuthn && (
        <Badge
          px={3}
          py={0.5}
          variant="gray"
          borderRadius={10}
          color="grey.100"
        >
          Recommended
        </Badge>
      )}
    </Card>
  );
};

export { CardConnector };
