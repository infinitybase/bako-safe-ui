import { Vault } from 'bakosafe';

const sendTransaction = async (vault: Vault, transactionHash: string) => {
  const { tx } = await vault.transactionFromHash(transactionHash);

  return await vault.send(tx);
};

export { sendTransaction };
