import { Accordion, Button, Center, Text } from 'bako-ui';
import { memo, useCallback } from 'react';

import { UserAddIcon } from '@/components';
import { Tooltip } from '@/components/ui/tooltip';
import { delay } from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface RecipientListProps {
  accordion: UseCreateTransaction['accordion'];
  transactions: UseCreateTransaction['transactionsFields'];
  children: React.ReactNode;
  allAssetsUsed: boolean;
  hasEthForFee: boolean;
  ethAssetId: string | undefined;
}

export const RecipientList = ({
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

      <Center mt={6} flexDirection="column" w="full">
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
              colorPalette="primary"
              bgColor="grey.200"
              border="none"
              _hover={{
                opacity: 0.8,
              }}
              _disabled={{
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
              disabled={allAssetsUsed}
              onClick={handleAddMoreRecipient}
            >
              <UserAddIcon />
              Add more recipients
            </Button>
          </Tooltip>
        )}
      </Center>
    </Accordion.Root>
  );
};

export default memo(RecipientList);
