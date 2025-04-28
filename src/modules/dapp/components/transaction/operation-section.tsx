import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

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

  return (
    <Box
      bg="grey.825"
      borderRadius="md"
      mb={2}
      overflow="hidden"
      color="white"
      borderColor="grey.950"
      borderWidth="1px"
      w="100%"
    >
      {hasTitle && (
        <Flex
          as="button"
          onClick={onToggle}
          cursor="pointer"
          w="100%"
          bg="transparent"
          px={4}
          align="center"
          border="none"
          minH="36px"
          justify="space-between"
        >
          <Text
            fontSize="sm"
            letterSpacing="-0.01em"
            color="white"
            fontWeight="500"
          >
            {title}
          </Text>

          {isOpen ? (
            <ChevronUpIcon boxSize="4" color="gray.400" />
          ) : (
            <ChevronDownIcon boxSize="4" color="gray.400" />
          )}
        </Flex>
      )}

      <MotionBox
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        display="flex"
        flexDirection="column"
        p={0.5}
        gap={0.5}
      >
        {operations.map((operation, index) => (
          <Box
            key={`${sectionKey}-${index}`}
            w="100%"
            borderRadius="md"
            overflow="hidden"
            boxShadow="shadows.transaction"
          >
            <DappTransaction.Operation
              vault={vault!}
              operation={operation}
              main={!hasTitle}
            />
          </Box>
        ))}
      </MotionBox>
    </Box>
  );
}
