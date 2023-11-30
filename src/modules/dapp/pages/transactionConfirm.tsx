import { Box, Button, Card } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useQueryParams } from '@/modules/auth';
import { Pages } from '@/modules/core';

import { useTransactionSocket } from '../hooks';

const TransactionConfirm = () => {
  const { emitEvent } = useTransactionSocket();
  const { sessionId } = useQueryParams();
  const navigate = useNavigate();

  if (!sessionId) {
    window.close();
    navigate(Pages.home());
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" h="100vh">
      <Card
        w="full"
        maxW={{ base: 'xs', md: 'md' }}
        p={20}
        bgColor="dark.300"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Button
          variant="primary"
          onClick={() => {
            emitEvent();
          }}
        ></Button>
      </Card>
    </Box>
  );
};

export { TransactionConfirm };
