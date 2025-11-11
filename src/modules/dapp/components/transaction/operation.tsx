import { Box, Flex, Separator, Text, VStack } from 'bako-ui';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { ChevronDownIcon } from '@/components';

import { UseTransactionSocket } from '../../hooks';
import { SimplifiedOperation } from '../../services/simplify-transaction';
import { DappTransaction } from '.';

const MotionBox = motion(Box);

type DappTransactionProps = {
  operation: SimplifiedOperation;
  vault?: UseTransactionSocket['vault'];
  renderSeparator: boolean;
};

function DappTransactionOperation({
  operation,
  vault,
  renderSeparator,
}: DappTransactionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isGrouped = (operation.operations?.length || 0) > 1;
  return (
    <VStack w="full" gap={1}>
      <Flex w="full" direction="column">
        <DappTransaction.Card vault={vault!} operation={operation} />

        {renderSeparator && <Separator borderColor="gray.600" m={4} />}
      </Flex>

      {isGrouped && (
        <Box w="full" bg="gray.700" borderRadius={8}>
          <Flex
            as="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
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
              + {operation.operations?.length} operations
            </Text>

            <ChevronDownIcon
              boxSize={3}
              color="gray.400"
              transition="transform 0.2s ease"
              transform={isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}
            />
          </Flex>

          <MotionBox
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
              opacity: { duration: 0.2 },
            }}
            display="flex"
            flexDirection="column"
          >
            {operation.operations?.map((op, index) => {
              const isLast = index === (operation.operations?.length ?? 0) - 1;

              return (
                <Flex
                  key={`${op.type}-${op.from?.address || ''}-${op.to?.address || ''}-${index}`}
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
      )}
    </VStack>
  );
}
export { DappTransactionOperation };
