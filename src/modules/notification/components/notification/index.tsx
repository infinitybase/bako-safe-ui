import {
  AlertStatus,
  Box,
  HStack,
  Text,
  UseToastOptions,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  leftIcon: React.ReactNode;
  onClose: () => void;
  status: AlertStatus;
  alignItems?: 'center' | 'flex-start';
}

const colors = {
  border: {
    success: 'success.800',
    error: 'error.800',
    warning: 'warning.675',
    info: 'info.700',
  },
  bg: {
    success: 'success.900',
    error: 'error.900',
    warning: 'warning.900',
    info: 'info.900',
  },
  title: {
    success: 'success.700',
    error: 'error.500',
    warning: 'brand.500',
    info: 'info.500',
  },
  description: {
    success: 'success.300',
    error: 'error.300',
    warning: 'brand.400',
    info: 'info.300',
  },
};

const Container = (props: ContainerProps) => {
  const [hide, setHide] = useState(false);

  return (
    <HStack
      alignItems={props.alignItems}
      padding={hide ? 4 : 2}
      spacing={2}
      boxShadow="lg"
      borderWidth={1}
      borderRadius={8}
      borderColor={colors.border[props?.status] ?? 'dark.100'}
      bg={colors.bg[props?.status] ?? 'dark.200'}
      whiteSpace="nowrap"
      overflow="hidden"
      position="relative"
      backdropFilter="blur(17px)"
      maxW={320}
      onClick={() => setHide(!hide)}
    >
      {props.leftIcon}
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        hidden={hide}
        overflow="hidden"
      >
        {props.children}
      </Box>
    </HStack>
  );
};

interface NotificationProps extends UseToastOptions {
  onClose: () => void;
}

const Notification = (props: NotificationProps) => {
  const containerAlignItems =
    props.title && props.description ? 'flex-start' : 'center';

  return (
    <Container
      onClose={props.onClose}
      leftIcon={props.icon}
      status={props.status!}
      alignItems={containerAlignItems}
    >
      {props.title && (
        <Text
          color={colors.title[props.status!]}
          fontSize="sm"
          fontWeight="semibold"
          lineHeight={1.4}
        >
          {props.title}
        </Text>
      )}
      {props.description && (
        <Text
          fontSize="xs"
          noOfLines={2}
          whiteSpace="pre-wrap"
          lineHeight={1.2}
          color={colors.description[props.status!] ?? 'grey.200'}
        >
          {props.description}
        </Text>
      )}
    </Container>
  );
};

export { Notification };
