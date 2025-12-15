import { Accordion, Button, Center, Text } from 'bako-ui';
import { memo, RefObject, useCallback } from 'react';

import { Plus2Icon } from '@/components/icons/plus2';
import { Tooltip } from '@/components/ui/tooltip';
import { delay } from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

interface RecipientListProps {
  ref?: RefObject<HTMLDivElement | null>;
  accordion: UseCreateTransaction['accordion'];
  transactions: UseCreateTransaction['transactionsFields'];
  children: React.ReactNode;
  allAssetsUsed: boolean;
  hasEthForFee: boolean;
  ethAssetId: string | undefined;
}

export const RecipientList = ({
  ref,
  transactions,
  accordion,
  children,
  allAssetsUsed,
  hasEthForFee,
  ethAssetId,
}: RecipientListProps) => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const handleAddMoreRecipient = useCallback(() => {
    transactions.append({
      amount: '',
      asset: ethAssetId ?? '',
      value: '',
    });
    delay(() => accordion.open(transactions.fields.length), 100);
  }, [transactions, ethAssetId, accordion]);

  return (
    <Accordion.Root
      ref={ref}
      value={[accordion.index.toString()]}
      overflowY="auto"
      pb={isMobile ? 10 : 0}
      maxH={450}
      pr={{ base: 1, sm: 0 }}
      css={{
        '&::-webkit-scrollbar': {
          width: '5px',
          maxHeight: '330px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#2C2C2C',
          borderRadius: '30px',
          height: '10px' /* Adjust the height of the scrollbar thumb */,
        },
      }}
    >
      {children}

      <Center mt={3} flexDirection="column" w="full">
        {!hasEthForFee ? (
          <Text
            color="error.500"
            fontSize="sm"
            w="full"
            textAlign="center"
            mt={2}
          >
            Insufficient funds for gas
          </Text>
        ) : (
          <Tooltip
            content="All available assets have been used."
            disabled={!allAssetsUsed}
            showArrow
            positioning={{ placement: 'top' }}
          >
            <Button
              id="add_more_recipient"
              w="full"
              size="sm"
              variant="subtle"
              bg="bg.muted"
              _hover={{
                bg: 'gray.550',
              }}
              _disabled={{
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
              disabled={allAssetsUsed}
              onClick={handleAddMoreRecipient}
            >
              <Plus2Icon />
              Add more recipients
            </Button>
          </Tooltip>
        )}
      </Center>
    </Accordion.Root>
  );
};

export default memo(RecipientList);
