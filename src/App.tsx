import { Button } from '@chakra-ui/react';
import { useState } from 'react';

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
