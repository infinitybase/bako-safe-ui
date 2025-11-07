
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

import { UseTransactionSocket } from '../../hooks';
import { DappTransaction } from '.';
import { Box, Flex, Text } from 'bako-ui';
import { SimplifiedOperation } from '../../services/simplify-transaction';
import { ChevronDownIcon } from '@/components';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

interface Props {
  title: string;
  operations: SimplifiedOperation[];
  vault: UseTransactionSocket['vault'];
};

export function DappTransactionOperationSectionGroup({
  title,
  operations,
  vault,
}: Props) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box
      w="full"
      bg="gray.700"
      borderRadius={8}
    >
      <Flex
        as="button"
        onClick={onToggle}
        align="center"
        justify="space-between"
        w="full"
        border="none"
        p={4}
        cursor="pointer"
      >
        <Text
          fontWeight={500}
          color="gray.100"
          fontSize="xs"
          lineHeight="12px"
        >
          {title}
        </Text>

        {isOpen ? (
          <ChevronDownIcon boxSize="3" color="gray.400" />
        ) : (
          <ChevronDownIcon boxSize="3" color="gray.400" /> // TODO ASDF > ALTERAR CHEVRON E COLOCAR ROTACAO
        )}
      </Flex>

      <MotionBox
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
          opacity: { duration: 0.2 },
        }}
        display="flex"
        flexDirection="column"
      >
        {operations.map((op, index) => {
          const isLast = index === ((operations?.length ?? 0) - 1);

          return (
            <Flex
              key={`${op.type}-${op.from}-${op.to}-${index}`}
              w="100%"
              borderRadius="md"
              overflow="hidden"
              boxShadow="shadows.transaction"
            >
              <DappTransaction.Operation
                operation={op}
                vault={vault!}
                renderSeparator={!isLast}
              />
            </Flex>
          );
        })}
      </MotionBox>
    </Box>
  );
}