import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AmountInput } from '@/components';
import { Pages } from '@/modules/core';

const ExamplePage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState('');

  console.log(params);

  return (
    <Box>
      Teste
      <Button onClick={() => navigate(Pages.example({ id: '123' }))}>
        {' '}
        Navigate{' '}
      </Button>
      <AmountInput value={value} onChange={(e) => setValue(e.target.value)} />
    </Box>
  );
};

export { ExamplePage };
