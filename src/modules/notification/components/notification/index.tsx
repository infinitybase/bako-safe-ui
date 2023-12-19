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
}

const colors = {
  bg: {
    success: 'success.900',
    error: 'error.900',
  },
  title: {
    success: 'brand.500',
    error: 'error.600',
  },
  description: {
    success: 'grey.200',
  },
};

const Container = (props: ContainerProps) => {
  const [hide, setHide] = useState(false);

  return (
    <HStack
      padding={hide ? 4 : 5}
      spacing={4}
      boxShadow="lg"
      borderWidth={1}
      borderRadius={10}
      borderColor={colors.bg[props?.status] ?? 'dark.100'}
      bg={colors.bg[props?.status] ?? 'dark.200'}
      whiteSpace="nowrap"
      overflow="hidden"
      position="relative"
      backdropFilter="blur(17px)"
      maxW={320}
      onClick={() => setHide(!hide)}
    >
      {props.leftIcon}
      <Box hidden={hide} overflow="hidden">
        {props.children}
      </Box>
    </HStack>
  );
};

interface NotificationProps extends UseToastOptions {
  onClose: () => void;
}

const Notification = (props: NotificationProps) => {
  return (
    <Container
      onClose={props.onClose}
      leftIcon={props.icon}
      status={props.status!}
    >
      <Text color={colors.title[props.status!]} fontWeight="semibold">
        {props.title}
      </Text>
      <Text
        fontSize={14}
        noOfLines={2}
        whiteSpace="pre-wrap"
        lineHeight={1.2}
        color={colors.description[props.status!] ?? 'grey.200'}
      >
        {props.description}
      </Text>
    </Container>
  );
};

export { Notification };
