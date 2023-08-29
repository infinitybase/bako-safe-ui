import { Box, Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import { Pages } from '@/modules/core';

const ExamplePage = () => {
  const params = useParams();
  const navigate = useNavigate();

  console.log(params);

  return (
    <Box>
      Teste
      <Button onClick={() => navigate(Pages.example({ id: '123' }))}>
        {' '}
        Navigate{' '}
      </Button>
    </Box>
  );
};

export { ExamplePage };
