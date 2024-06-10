const TRANSACTIONS_QUERY = `query Transactions($address: Address) {
  transactionsByOwner(owner: $address, first: 5) {
    nodes {
      id
      inputs {
        __typename
        ... on InputCoin {
          owner
          utxoId
          amount
          assetId
        }
        ... on InputContract {
          utxoId
          contractId
        }
        ... on InputMessage {
          sender
          recipient
          amount
          data
        }
      }
      outputs {
        __typename
        ... on CoinOutput {
          to
          amount
          assetId
        }
        ... on ContractOutput {
          inputIndex
          balanceRoot
          stateRoot
        }
        ... on ChangeOutput {
          to
          amount
          assetId
        }
        ... on VariableOutput {
          to
          amount
          assetId
        }
        ... on ContractCreated {
          contract
          stateRoot
        }
      }
      status {
        __typename
        ... on FailureStatus {
          reason
          programState {
            returnType
          }
        }
      }
    }
  }
}`;

const TRANSACTIONS_ARGS = {
  address: '0x893e864a5ab4e64f1e618910c57638499f50a04c471b138e1705b99193dbca6c',
};

const getTransactions = async () => {
  // https://testnet.fuel.network/v1/graphql
  // http://localhost:4000/v1/graphql
  const response = await fetch('https://testnet.fuel.network/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: TRANSACTIONS_QUERY,
      variables: TRANSACTIONS_ARGS,
    }),
  });
  const json: any = await response.json();
  // console.log('TRANSACTIONS:', json.data.transactionsByOwner.nodes);
  console.log('Recebedor recebeu:', json.data.transactionsByOwner.nodes[0]);
  console.log('Recebedor enviou:', json.data.transactionsByOwner.nodes[2]);
};

export { getTransactions };
