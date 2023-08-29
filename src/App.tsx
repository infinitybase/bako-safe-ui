import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {count}
      Teste
      <button onClick={() => setCount(count + 1)}>a</button>
    </>
  );
}

export default App;
