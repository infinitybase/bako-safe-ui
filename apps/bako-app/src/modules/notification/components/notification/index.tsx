import {
  type AlertStatus,
  Box,
  HStack,
  Text,
  type UseToastOptions,
} from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  leftIcon: React.ReactNode;
  onClose: () => void;
  status: AlertStatus;
  alignItems?: 'center' | 'flex-start';
}

const colors = {
  border: {
    success: 'success.750',
    error: 'error.700',
    warning: 'warning.660',
    info: 'info.650',
    loading: 'brand.500',
  },
  bg: {
    success: 'success.800',
    error: 'error.800',
    warning: 'warning.675',
    info: 'info.700',
    loading: 'brand.500',
  },
  title: {
    success: 'success.700',
    error: 'error.500',
    warning: 'brand.500',
    info: 'info.500',
    loading: 'brand.500',
  },
  description: {
    success: 'success.300',
    error: 'error.300',
    warning: 'brand.400',
    info: 'info.300',
    loading: 'brand.500',
  },
};

const Container = (props: ContainerProps) => {
  const [hide, setHide] = useState(false);

  return (
    <Box
      bg={colors.bg[props?.status] ?? 'dark.200'}
      borderRadius={8}
      boxShadow="lg"
      borderWidth={1}
      borderColor={colors.border[props?.status] ?? 'dark.100'}
      overflow="hidden"
      backdropFilter="blur(30px)"
    >
      <HStack
        alignItems={props.alignItems}
        padding={hide ? 4 : 2}
        spacing={2}
        bg="dark.225"
        backdropFilter="blur(30px)"
        whiteSpace="nowrap"
        overflow="hidden"
        position="relative"
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
    </Box>
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
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      status={props.status!}
      alignItems={containerAlignItems}
    >
      {props.title && (
        <Text
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
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
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          color={colors.description[props.status!] ?? 'grey.200'}
        >
          {props.description}
        </Text>
      )}
    </Container>
  );
};

export { Notification };
