import { Accordion, Button, Center } from '@chakra-ui/react';
import { memo } from 'react';

import { UserAddIcon } from '@/components';
import { delay, NativeAssetId } from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface RecipientListProps {
  accordion: UseCreateTransaction['accordion'];
  transactions: UseCreateTransaction['transactionsFields'];
  children: React.ReactNode;
}

export const RecipientList = (props: RecipientListProps) => {
  const { transactions, accordion, children } = props;

  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const handleAddMoreRecipient = () => {
    transactions.append({
      amount: '',
      asset: NativeAssetId,
      value: '',
    });
    delay(() => accordion.open(transactions.fields.length), 100);
  };

  return (
    <Accordion
      index={accordion.index}
      overflowY="auto"
      pb={isMobile ? 10 : 0}
      maxH={450}
      pr={{ base: 1, sm: 0 }}
      sx={{
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

      <Center mt={6}>
        <Button
          w="full"
          leftIcon={<UserAddIcon />}
          variant="primary"
          bgColor="grey.200"
          border="none"
          _hover={{
            opacity: 0.8,
          }}
          onClick={handleAddMoreRecipient}
        >
          Add more recipients
        </Button>
      </Center>
    </Accordion>
  );
};

export default memo(RecipientList);
