import { useState } from 'react';
import { Button } from '@chakra-ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {count}
      Teste
      <Button onClick={() => setCount(count + 1)}>a</Button>
    </>
  );
}

export default App;
