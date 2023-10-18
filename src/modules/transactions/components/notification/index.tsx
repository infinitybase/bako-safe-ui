import { Box, HStack, Text, UseToastOptions } from '@chakra-ui/react';
import React, { useState } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  leftIcon: React.ReactNode;
  onClose: () => void;
}

const Container = (props: ContainerProps) => {
  const [hide, setHide] = useState(false);

  return (
    <HStack
      padding={hide ? 4 : 5}
      spacing={4}
      boxShadow="lg"
      borderWidth={1}
      borderRadius={10}
      borderColor="dark.100"
      backgroundColor="dark.200"
      whiteSpace="nowrap"
      overflow="hidden"
      onClick={() => setHide(!hide)}
    >
      {props.leftIcon}
      <Box hidden={hide} overflow="hidden">
        {props.children}
      </Box>
    </HStack>
  );
};

interface TransactionSendNotificationProps extends UseToastOptions {
  onClose: () => void;
}

const TransactionSendNotification = (
  props: TransactionSendNotificationProps,
) => (
  <Container onClose={props.onClose} leftIcon={props.icon}>
    <Text color="grey.200" fontWeight="semibold">
      {props.title}
    </Text>
    {props.description}
  </Container>
);

export { TransactionSendNotification };
