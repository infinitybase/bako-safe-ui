import { TransactionStatus, Vault } from 'bakosafe';
import { Address, BN, bn } from 'fuels';
import { useCallback, useEffect, useState } from 'react';

import { Rig } from '@/contracts/rig/mainnet/types';
import { instantiateVault, useBakoSafeVault } from '@/modules/core';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { availableNetWorks, NetworkType } from '@/modules/network/services';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { TransactionService } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useVaultInfosContext } from '../../hooks';
import { DECIMALS } from './useTotalFuelTokens';

const RIG_ID_CONTRACT = import.meta.env.VITE_RIG_ID_CONTRACT!;
const WALLET_BAKO = import.meta.env.VITE_WALLET_BAKO!;

const FUEL_TOKEN_ID = tokensIDS.FUEL;
const DEVIATION_PERCENT = 0.001;

const useDepositLiquidStake = () => {
  const [rig, setRig] = useState<Rig>();
  const [price, setPrice] = useState<number>(0);
  const [wallet, setWallet] = useState<Vault>();
  const { vault } = useVaultInfosContext();

  const {
    vaultDetails: {
      vaultRequest: {
        data: { predicateAddress, provider, id },
      },
    },
  } = useWorkspaceContext();

  const {
    isPendingSigner,
    transactionsPageList: {
      request: { refetch: refetchTransactionsList },
    },
    homeTransactions: {
      request: { refetch: refetchHomeTransactionsList },
    },
    vaultTransactions: {
      request: { refetch: refetchVaultTransactionsList },
    },
    signTransaction: { confirmTransaction },
  } = useTransactionsContext();

  const { vault: vaultSafe } = useBakoSafeVault({
    address: predicateAddress,
    provider,
    id,
  });

  const instanceContract = useCallback(async () => {
    try {
      const predicateAddress = vault?.data?.predicateAddress ?? '';
      const providerUrl = availableNetWorks[NetworkType.MAINNET].url;

      if (!predicateAddress || !providerUrl) return;

      const vaultInstance = await instantiateVault({
        predicateAddress,
        providerUrl,
      });

      const rig = new Rig(RIG_ID_CONTRACT, vaultInstance);
      const price = (await rig.functions.get_sanitized_price().get()).value;

      setRig(rig);
      setWallet(vaultInstance);
      setPrice(Number(price.toString()));
    } catch (error) {
      console.error('error instantiating contract', error);
    }
  }, [vault?.data?.predicateAddress]);

  const depositWithVault = async (amount: BN) => {
    if (!wallet || !rig) {
      throw new Error(' Wallet ou rig contract not defined');
    }

    const estimatedOutput = amount.mul(price).div(bn(10).pow(9));

    const bnAmount = estimatedOutput;
    const deviation = bnAmount
      .mul(new BN(DEVIATION_PERCENT * 10000))
      .div(new BN(10000));
    const minAmount = bnAmount.sub(deviation);

    const tx = await rig.functions
      .deposit(
        { Address: { bits: new Address(WALLET_BAKO).toB256() } },
        minAmount,
      )
      .callParams({
        forward: {
          amount,
          assetId: FUEL_TOKEN_ID,
        },
      })
      .addContracts([rig])
      .fundWithRequiredCoins();

    if (!vaultSafe) return;

    const { hashTxId } = await vaultSafe.BakoTransfer(tx, {
      name: 'Liquid Stake',
    });

    const transaction = await TransactionService.getByHash(hashTxId, [
      TransactionStatus.AWAIT_REQUIREMENTS,
    ]);

    await confirmTransaction(transaction.id, undefined, transaction).finally(
      async () => {
        await refetchVaultTransactionsList();
        await refetchTransactionsList();
        await refetchHomeTransactionsList();
      },
    );

    return transaction;
  };

  const getMaxFee = useCallback(
    async (amount: BN) => {
      if (!wallet || !rig) {
        return;
      }

      try {
        const estimatedOutput = amount.mul(price).div(bn(10).pow(9));

        const bnAmount = estimatedOutput;
        const deviation = bnAmount
          .mul(new BN(DEVIATION_PERCENT * 10000))
          .div(new BN(10000));
        const minAmount = bnAmount.sub(deviation);

        const tx = await rig.functions
          .deposit(
            { Address: { bits: new Address(WALLET_BAKO).toB256() } },
            minAmount,
          )
          .callParams({
            forward: {
              amount,
              assetId: FUEL_TOKEN_ID,
            },
          })
          .fundWithRequiredCoins();

        if (vaultSafe) {
          const { maxFee } = await vaultSafe.prepareTransaction(tx);

          const maxFeeWithDecimals = Number(maxFee.toString()) / DECIMALS;

          return maxFeeWithDecimals;
        }
      } catch (error) {
        console.error('Error getMaxFee', error);
      }
    },
    [wallet, rig, price, vaultSafe],
  );

  useEffect(() => {
    instanceContract();
  }, [instanceContract]);

  return {
    rigContract: rig,
    price: price / DECIMALS,
    isPendingSigner,
    depositWithVault,
    getMaxFee,
  };
};

export { useDepositLiquidStake };
