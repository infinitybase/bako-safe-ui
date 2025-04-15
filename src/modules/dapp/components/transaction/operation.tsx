import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { UseTransactionSocket } from '../../hooks';
import { SimplifiedOperation } from '../../services/simplify-transaction';
import { DappTransactionOperationCard } from './operation-card';

const MotionBox = motion(Box);

type DappTransactionProps = {
  operation: SimplifiedOperation;
  isChild?: boolean;
  vault?: UseTransactionSocket['vault'];
};

function DappTransactionOperation({
  operation,
  vault,
  isChild = false,
}: DappTransactionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isGrouped = (operation.operations?.length || 0) > 1;

  return (
    <Box w="100%">
      <Flex p={isChild ? 0 : '2px'} gap="8px" direction="column">
        <Box
          w="100%"
          borderRadius="8px"
          overflow="hidden"
          boxShadow="0px 2px 6px -1px rgba(32, 32, 32, 0.1), 0px 0px 0px 1px rgba(32, 32, 32, 0.12)"
        >
          <DappTransactionOperationCard vault={vault!} operation={operation} />
        </Box>
      </Flex>

      {isGrouped && (
        <>
          <Flex
            as="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            align="center"
            justify="center"
            w="100%"
            bg="transparent"
            border="none"
            py="8px"
            cursor="pointer"
          >
            <Text
              display="flex"
              alignItems="center"
              gap="8px"
              color="gray.400"
              fontSize="sm"
            >
              <Box
                as={Icon}
                transform={isExpanded ? 'rotate(45deg)' : 'rotate(0deg)'}
                transition="all 0.2s ease"
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M12 2L12 22M2 12L22 12" />
              </Box>
              {isExpanded ? 'Collapse' : 'Expand'}
              {!isExpanded && (
                <Text as="span" fontSize="sm" color="gray.500">
                  (+{operation.operations?.length} operations)
                </Text>
              )}
            </Text>
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
            gap="2px"
            p="2px"
          >
            {operation.operations?.map((op, index) => (
              <Flex
                key={`${op.type}-${op.from?.address || ''}-${op.to?.address || ''}-${index}`}
                w="100%"
                borderRadius="8px"
                overflow="hidden"
                boxShadow="0px 2px 6px -1px rgba(32,32,32,0.1), 0px 0px 0px 1px rgba(32,32,32,0.12)"
              >
                <DappTransactionOperation operation={op} isChild />
              </Flex>
            ))}
          </MotionBox>
        </>
      )}
    </Box>
  );
}
export { DappTransactionOperation };
