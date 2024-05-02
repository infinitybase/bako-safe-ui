import {
  Avatar,
  Badge,
  Box,
  Divider,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';

import { Card } from '@/components';
import { useQueryParams } from '@/modules/auth/hooks';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
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

interface ConnectorsListProps {
  connectors: ConnectorType[];
  onSelect: (connector: string) => void;
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
      bgColor={isWebAuthn ? 'warning.900' : 'grey.825'}
      borderColor={isWebAuthn ? 'brand.500' : 'grey.550'}
      onClick={selectConnector}
      position="relative"
      transition="0.5s"
      _hover={
        isWebAuthn
          ? {
              bg: 'warning.700',
            }
          : {
              borderColor: 'grey.75',
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

const ConnectorsList = ({ connectors, onSelect }: ConnectorsListProps) => {
  const { byConnector, sessionId } = useQueryParams();
  const webAuthnConnector = connectors.find(
    (connector) => connector.name === EConnectors.WEB_AUTHN,
  );

  const allOtherConnectors = connectors.filter(
    (connector) => connector.name !== EConnectors.WEB_AUTHN,
  );

  return (
    <VStack spacing={{ base: 4, md: 8 }} w="full">
      <Text
        color="grey.50"
        fontSize={{ base: 'xs', md: 'sm' }}
        maxW={366}
        mb={{ base: 4, md: 0 }}
      >
        Select your preferred access mode
      </Text>

      <CardConnector
        connector={webAuthnConnector!}
        isWebAuthn
        onClick={() => {
          const isConnector = byConnector && !!sessionId;
          // console.log('isConnector', isConnector);
          // console.log(
          //   window.location.pathname,
          //   window.location.search,
          //   window.origin,
          // );

          if (isConnector) {
            window.open(
              `${window.origin}/${window.location.search}&openWebAuth=true`,
              '_blank',
            );
          }
          return onSelect(EConnectors.WEB_AUTHN);
        }}
      />

      <HStack w="full" spacing={5}>
        <Divider borderColor="grey.500" />
        <Text color="grey.250" fontSize="xs" fontWeight="light">
          OR
        </Text>
        <Divider borderColor="grey.500" />
      </HStack>

      <Stack
        flexDirection={{ base: 'column', sm: 'row' }}
        w="full"
        spacing={{ base: 4, sm: 2 }}
      >
        {allOtherConnectors.map((connector) => (
          <CardConnector
            key={connector.name}
            connector={connector}
            onClick={onSelect}
          />
        ))}
      </Stack>
    </VStack>
  );
};

export { CardConnector, ConnectorsList };
