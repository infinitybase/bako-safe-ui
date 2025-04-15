import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

import { UseTransactionSocket } from '../../hooks';
import { SimplifiedOperation } from '../../services/simplify-transaction';
import { DappTransaction } from '.';

type DappTransactionOperationSectionProps = {
  title?: string;
  operations: SimplifiedOperation[];
  isOpen: boolean;
  onToggle: () => void;
  vault: UseTransactionSocket['vault'];
  sectionKey: string;
};

export function DappTransactionOperationSection({
  title,
  operations,
  isOpen,
  onToggle,
  vault,
  sectionKey,
}: DappTransactionOperationSectionProps) {
  const hasTitle = Boolean(title);
  const hasOperations = operations.length > 0;

  return (
    <Box
      bg="#201f1d"
      borderRadius="10px"
      mb="8px"
      overflow="hidden"
      color="white"
      w="100%"
    >
      {hasTitle && (
        <Flex
          as="button"
          onClick={onToggle}
          cursor="pointer"
          w="100%"
          bg="transparent"
          px="16px"
          align="center"
          border="none"
          minH="36px"
          justify="space-between"
        >
          <Flex gap="8px" align="center">
            <Text
              fontSize="13px"
              letterSpacing="-0.01em"
              color="#646464"
              fontWeight="500"
            >
              {title}
            </Text>
          </Flex>
        </Flex>
      )}

      <MotionBox
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        display="flex"
        flexDirection="column"
        p="2px"
        gap="2px"
      >
        {hasOperations ? (
          operations.map((operation, index) => (
            <Box
              key={`${sectionKey}-${index}`}
              w="100%"
              borderRadius="8px"
              overflow="hidden"
              boxShadow="0px 2px 6px -1px rgba(32, 32, 32, 0.1), 0px 0px 0px 1px rgba(32, 32, 32, 0.12)"
            >
              <DappTransaction.Operation vault={vault!} operation={operation} />
            </Box>
          ))
        ) : hasTitle ? (
          <Box
            display="flex"
            cursor="default"
            w="100%"
            bg="#201f1d"
            px="16px"
            alignItems="center"
            border="none"
            minH="36px"
            borderRadius="10px"
          >
            <Text fontSize="14px" color="white" fontWeight="500">
              No operations available.
            </Text>
          </Box>
        ) : null}
      </MotionBox>
    </Box>
  );
}
