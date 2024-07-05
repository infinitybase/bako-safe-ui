import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
  HStack,
  Icon,
  Stack,
  StackProps,
  Text,
  useAccordionItemState,
  VStack,
} from '@chakra-ui/react';
import { AddressType } from '@fuel-wallet/types';
import { ITransaction, ITransferAsset, TransactionStatus } from 'bakosafe';
import { Address } from 'fuels';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';
import { css, keyframes } from '@emotion/react';

import {
  CustomSkeleton,
  DoubleArrowIcon,
  MinimalAlertIcon,
  UpRightArrowWhite,
} from '@/components';
import {
  AddressUtils,
  AssetModel,
  assetsMap,
  TransactionState,
  useScreenSize,
} from '@/modules/core';
import { limitCharacters } from '@/utils';

import DetailsTransactionStepper from './DetailsTransactionStepper';
import { TransactionStepper } from './TransactionStepper';

import { TransactionType } from '../../services/types';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';
import { DepositDetails } from './DepositDetails';
import { DeployIcon } from '@/components/icons/tx-deploy';

const shakeAnimation = keyframes`
  0% { transform: translateY(0); }
  25% { transform: translateY(-2px); }
  50% { transform: translateY(2px); }
  75% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

export type TransactionUI = Omit<ITransaction, 'assets'> & {
  assets: {
    assetId: string;
    amount: string;
    to: string;
    recipientNickname?: string;
  }[];
  type: TransactionType;
};
interface TransactionDetailsProps {
  transaction: TransactionUI;
  status?: TransactionState;
  isInTheVaultPage?: boolean;
  isMobile?: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
}

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  contractAddress?: string;
  hasToken?: boolean;
  isDeposit: boolean;
  isDeploy?: boolean;
  isContract?: boolean;
}

const AssetBoxInfo = ({
  asset,
  contractAddress,
  hasToken,
  isDeposit,
  isDeploy,

  ...props
}: AssetBoxInfoProps) => {
  const isContract = !!contractAddress;
  const { isMobile, isExtraSmall } = useScreenSize();

  const assetInfo = useMemo(
    () => (asset?.assetId ? assetsMap[asset?.assetId] : null),
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD([asset as ITransferAsset]);

  const contractWithoutToken = isContract && !hasToken;

  return (
    <HStack
      py={2}
      spacing={{ base: 1, sm: 14 }}
      w="full"
      borderTopWidth={1}
      {...props}
    >
      {contractWithoutToken ? (
        <Text
          fontWeight="semibold"
          color="grey.425"
          w={{ base: 'full', sm: 'unset' }}
        >
          Contract execution
        </Text>
      ) : (
        <>
          {assetInfo && (
            <HStack spacing={{ base: 2, sm: 3 }} minW="76px">
              <Avatar
                name={assetInfo.slug}
                size="xs"
                src={assetInfo.icon}
                ignoreFallback
              />
              <Text fontSize="sm" color="grey.500">
                {assetInfo.slug}
              </Text>
            </HStack>
          )}

          <Box mt={0.5} w={{ base: '105px' }}>
            <Text
              textAlign="center"
              variant={isMobile ? 'title-sm' : 'title-md'}
              color="grey.75"
              fontSize="sm"
            >
              {isDeposit ? null : '-'}
              {asset?.amount}
            </Text>
            <Text
              textAlign="center"
              variant="description"
              fontSize="xs"
              color="grey.500"
            >
              ${txUSDAmount}
            </Text>
          </Box>
        </>
      )}

      <Center
        p={{ base: 1.5, sm: 3 }}
        borderRadius={5}
        bgColor="grey.825"
        borderWidth={1}
        borderColor="grey.925"
        boxSize="30px"
      >
        <Icon
          color="grey.250"
          fontSize={isDeploy ? '12.8px' : !isContract ? '18px' : '12.8px'}
          as={isDeploy ? DeployIcon : !isContract ? DoubleArrowIcon : FaPlay}
        />
      </Center>

      {isContract && (
        <VStack spacing={0} alignItems="flex-end">
          <HStack spacing={3}>
            <Text
              maxW="228px"
              w="full"
              fontSize="sm"
              color="grey.75"
              textOverflow="ellipsis"
              isTruncated
              ml="2px"
            >
              {isExtraSmall
                ? limitCharacters(
                    AddressUtils.format(
                      Address.fromString(
                        '0xfa6f5d747cd78ded64a29f44a8f7ae3fbe0cc9f668cb3d15a33adc3f334f73b6',
                      ).toAddress(),
                    ) ?? '',
                    7,
                  )
                : AddressUtils.format(
                    Address.fromString(
                      '0xfa6f5d747cd78ded64a29f44a8f7ae3fbe0cc9f668cb3d15a33adc3f334f73b6',
                    ).toAddress(),
                    isMobile ? 10 : 24,
                  )}
            </Text>
          </HStack>
        </VStack>
      )}

      {!isContract && !!asset && (
        <VStack
          h="full"
          w="full"
          minH={51}
          maxW={200}
          spacing={0}
          justifyContent="center"
          alignItems={{ base: 'center', sm: 'start' }}
        >
          <Text
            maxW="228px"
            w="full"
            fontSize="sm"
            color="grey.75"
            textOverflow="ellipsis"
            isTruncated
            ml="2px"
          >
            {isExtraSmall
              ? limitCharacters(
                  AddressUtils.format(
                    Address.fromString(asset.to ?? '').toAddress(),
                  ) ?? '',
                  7,
                )
              : AddressUtils.format(
                  Address.fromString(asset.to ?? '').toAddress(),
                  isMobile ? 10 : 24,
                )}
          </Text>
        </VStack>
      )}
    </HStack>
  );
};

const Details = ({
  transaction,
  status,
  isInTheVaultPage,
  isMobile,
  isDeploy,
}: TransactionDetailsProps) => {
  const fromConnector = !!transaction?.summary;

  const mainOperation = transaction?.summary?.operations?.[0];
  const isContract = mainOperation?.to?.type === AddressType.contract;
  const hasToken = !!mainOperation?.assetsSent?.length;
  const isPending = transaction.status === TransactionStatus.AWAIT_REQUIREMENTS;
  const notSigned = !status?.isDeclined && !status?.isSigned;

  const isDeposit = transaction.type === TransactionType.DEPOSIT;

  const handleViewInExplorer = async () => {
    const { hash } = transaction;
    window.open(
      `${import.meta.env.VITE_BLOCK_EXPLORER}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  const { isOpen } = useAccordionItemState();

  if (!isMobile && !isOpen) return null;

  return (
    <DetailsTransactionStepper transactionId={transaction.id}>
      {(isLoading, transactionHistory) => (
        <CustomSkeleton py={2} isLoaded={!isLoading && !!transactionHistory}>
          {isDeposit ? (
            <DepositDetails transaction={transaction} />
          ) : (
            <VStack w="full">
              <Stack
                pt={{ base: 0, sm: 5 }}
                alignSelf="flex-start"
                display="flex"
                direction={{ base: 'column', md: 'row' }}
                alignItems="start"
                justify="space-between"
                columnGap={isInTheVaultPage ? '3rem' : '72px'}
                w="full"
              >
                <Box
                  display="flex"
                  flexDirection={{ base: 'row', xs: 'column' }}
                  w="full"
                  minW={{ base: 200, sm: '476px' }}
                  flexWrap="wrap"
                >
                  <Box mb={4}>
                    <Text color="grey.425" fontSize="sm">
                      Transaction breakdown
                    </Text>
                  </Box>

                  <Box
                    alignItems="flex-start"
                    flexWrap="wrap"
                    mb={fromConnector ? 4 : 0}
                  >
                    {transaction.assets.map((asset, index) => (
                      <>
                        <AssetBoxInfo
                          isContract={isContract}
                          isDeploy={isDeploy}
                          isDeposit={isDeposit}
                          key={index}
                          asset={{
                            assetId: asset.assetId,
                            amount: asset.amount,
                            to: asset.to,
                            transactionID: transaction.id,
                            recipientNickname: asset?.recipientNickname,
                          }}
                          borderColor="grey.950"
                          borderBottomWidth={
                            index === transaction.assets.length - 1 ? 1 : 0
                          }
                          hasToken={hasToken}
                        />
                        {isContract && (
                          <AssetBoxInfo
                            borderTop="none"
                            isContract={false}
                            isDeploy={isDeploy}
                            isDeposit={isDeposit}
                            key={index}
                            asset={{
                              assetId: asset.assetId,
                              amount: asset.amount,
                              to: asset.to,
                              transactionID: transaction.id,
                              recipientNickname: asset?.recipientNickname,
                            }}
                            borderColor="grey.950"
                            borderBottomWidth={
                              index === transaction.assets.length - 1 ? 1 : 0
                            }
                            hasToken={hasToken}
                          />
                        )}
                      </>
                    ))}
                    {isContract && !transaction.assets.length && (
                      <AssetBoxInfo
                        isDeposit={isDeposit}
                        contractAddress={Address.fromB256(
                          mainOperation.to?.address ?? '',
                        ).toString()}
                        borderColor={'transparent'}
                        hasToken={hasToken}
                      />
                    )}
                  </Box>

                  {isContract && (
                    <>
                      <Card
                        bgColor="grey.825"
                        borderColor="grey.925"
                        borderRadius={10}
                        w={{ base: 'full', xs: 'unset' }}
                        px={5}
                        py={{ base: 2, xs: 4 }}
                        borderWidth="1px"
                        mt={4}
                      >
                        <Text color="grey.550" fontSize="xs">
                          Requesting a transaction from:
                        </Text>

                        <Divider borderColor="grey.950" my={4} />

                        <HStack
                          width="100%"
                          alignItems="center"
                          spacing={4}
                          h="32px"
                        >
                          <Avatar
                            borderRadius="6.4px"
                            color="white"
                            bgColor="dark.950"
                            // src={transaction.summary?.image}
                            // name={transaction.summary?.name}
                            name="Eita Assim"
                            size="sm"
                          />
                          <VStack alignItems="flex-start" spacing={0}>
                            <Text
                              variant="subtitle"
                              fontSize="14px"
                              color="grey.250"
                            >
                              {transaction.summary?.name}
                              Transaction De mentirinha hihihi
                            </Text>
                            <Text
                              color="brand.500"
                              variant="description"
                              fontSize="xs"
                            >
                              bakoconnector-git-gr-featbakosafe-infinity-base.vercel.app
                              {/* {transaction.summary?.origin.split('//')[1]} */}
                            </Text>
                          </VStack>
                        </HStack>
                        {isPending && notSigned && isContract && (
                          <HStack
                            bg="warning.700"
                            borderColor="warning.700"
                            borderWidth="1px"
                            borderRadius={10}
                            mt={{ base: 4, xs: 8 }}
                            py={4}
                            px={4}
                          >
                            <Icon
                              as={MinimalAlertIcon}
                              color="warning.600"
                              fontSize={28}
                              // alignSelf="start"
                              mt={-7}
                            />

                            <VStack spacing={0} alignItems="flex-start">
                              <Text
                                fontWeight="bold"
                                color="#FFC010"
                                fontSize="sm"
                              >
                                Double check it!
                              </Text>
                              <Text color="#EED07C" fontSize="xs">
                                Please carefully review this externally created
                                transaction before approving it.
                              </Text>
                            </VStack>
                          </HStack>
                        )}
                      </Card>
                    </>
                  )}

                  <Box
                    w="full"
                    hidden={transaction.status !== TransactionStatus.SUCCESS}
                    mt={4}
                  >
                    <HStack gap={8} justifyContent="space-between">
                      <Text color="grey.75" fontSize="xs">
                        Gas Fee (ETH)
                      </Text>
                      <Text color="grey.75" fontSize="xs">
                        -{transaction.gasUsed}
                      </Text>
                    </HStack>
                  </Box>
                </Box>

                <Box
                  alignSelf="flex-start"
                  w="full"
                  minW={{ base: 200, sm: '476px' }}
                >
                  <TransactionStepper steps={transactionHistory!} />
                </Box>
              </Stack>

              {transaction.status === TransactionStatus.SUCCESS && (
                <Button
                  border="none"
                  bgColor="#F5F5F50D"
                  fontSize="xs"
                  fontWeight="normal"
                  letterSpacing=".5px"
                  alignSelf={{ base: 'stretch', sm: 'flex-end' }}
                  variant="secondary"
                  onClick={handleViewInExplorer}
                  css={css`
                    &:hover .btn-icon {
                      animation: ${shakeAnimation} 0.5s ease-in-out;
                    }
                  `}
                  rightIcon={
                    <Icon
                      as={UpRightArrowWhite}
                      fontSize="lg"
                      className="btn-icon"
                    />
                  }
                >
                  View on Explorer
                </Button>
              )}
            </VStack>
          )}
        </CustomSkeleton>
      )}
    </DetailsTransactionStepper>
  );
};

export { Details, AssetBoxInfo };
