import { CheckIcon } from '@chakra-ui/icons';
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
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import { AddressType } from '@fuel-wallet/types';
import { ITransaction, ITransferAsset, TransactionStatus } from 'bakosafe';
import { Address } from 'fuels';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';
import { css, keyframes } from '@emotion/react';

import {
  AlertIcon,
  CopyIcon,
  CustomSkeleton,
  DoubleArrowIcon,
  UpRightArrowWhite,
} from '@/components';
import {
  AddressUtils,
  AssetModel,
  assetsMap,
  TransactionState,
  useScreenSize,
} from '@/modules/core';
import { useNotification } from '@/modules/notification';
import { limitCharacters } from '@/utils';

import DetailsTransactionStepper from './DetailsTransactionStepper';
import { TransactionStepper } from './TransactionStepper';

import { TransactionType } from '../../services/types';
import { useTxAmountToUSD } from '@/modules/assets-tokens/hooks/useTxAmountToUSD';

const shakeAnimation = keyframes`
  0% { transform: translateY(0); }
  25% { transform: translateY(-2px); }
  50% { transform: translateY(2px); }
  75% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

type TransactionUI = Omit<ITransaction, 'assets'> & {
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
}

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  contractAddress?: string;
  hasToken?: boolean;
  isDeposit: boolean;
}

const AssetBoxInfo = ({
  asset,
  contractAddress,
  hasToken,
  isDeposit,
  ...props
}: AssetBoxInfoProps) => {
  const toast = useNotification();
  const isContract = !!contractAddress;
  const clipboard = useClipboard(
    isContract ? contractAddress : asset?.to ?? '',
  );
  const { isMobile, isExtraSmall } = useScreenSize();

  const assetInfo = useMemo(
    () => (asset?.assetId ? assetsMap[asset?.assetId] : null),
    [asset?.assetId],
  );

  const txUSDAmount = useTxAmountToUSD([asset as ITransferAsset]);

  const contractWithoutToken = isContract && !hasToken;
  const nickname = asset?.recipientNickname;

  return (
    <HStack
      py={2}
      spacing={{ base: 1, sm: 8 }}
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
            <HStack spacing={{ base: 2, sm: 4 }}>
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

          <HStack>
            <Box mt={0.5} w={{ base: 120, sm: 140 }}>
              <Text
                textAlign="center"
                variant={isMobile ? 'title-sm' : 'title-md'}
                color="grey.75"
                fontSize="sm"
              >
                {isDeposit ? '+' : '-'}
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
          </HStack>
        </>
      )}

      <Center
        p={{ base: 1.5, sm: 3 }}
        borderRadius={5}
        // bgColor={isContract ? 'brand.500' : "grey.825"}
        bgColor="grey.825"
        borderWidth={1}
        borderColor="grey.925"
        boxSize="30px"
      >
        <Icon
          // color={isContract ? 'black' : 'brand.500'}
          color="grey.250"
          fontSize="18px"
          as={!isContract ? DoubleArrowIcon : FaPlay}
        />
      </Center>

      {isContract && (
        <VStack spacing={0} alignItems="flex-end">
          <HStack spacing={3}>
            <Text color="grey.200" fontSize={{ base: 'xs', sm: 'md' }} ml={1}>
              {AddressUtils.format(
                Address.fromString(contractAddress).toAddress(),
                8,
              )}
            </Text>
            <Icon
              color="grey.500"
              fontSize={{ base: 'xs', sm: 'sm' }}
              as={CopyIcon}
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                clipboard.onCopy();
                toast({
                  position: 'top-right',
                  duration: 2000,
                  isClosable: false,
                  title: 'Copied to clipboard',
                  icon: (
                    <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />
                  ),
                });
              }}
            />
          </HStack>
          <Text color="grey.500" fontSize="xs">
            Contract
          </Text>
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
          {!!nickname && (
            <Text
              fontSize={{ base: 'sm', sm: 'lg' }}
              color="grey.75"
              maxW={{ base: 100, sm: 220 }}
              isTruncated
            >
              {nickname}
            </Text>
          )}

          <Text
            maxW={{ base: 120, md: 200, lg: 250, '2xl': '100%' }}
            fontSize="sm"
            color="grey.75"
            textOverflow="ellipsis"
            isTruncated
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
          <VStack w="full">
            <Stack
              pt={{ base: 0, sm: 5 }}
              alignSelf="flex-start"
              display="flex"
              direction={{ base: 'column', md: 'row' }}
              alignItems="start"
              justify="space-between"
              columnGap={isInTheVaultPage ? '3rem' : '8rem'}
              w="full"
            >
              <Box
                display="flex"
                flexDirection={{ base: 'row', xs: 'column' }}
                w={{ base: '100%', lg: 'unset' }}
                minW={{ base: 200, sm: 486 }}
                flexWrap="wrap"
              >
                <Box mb={2}>
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
                    <AssetBoxInfo
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

                {fromConnector && (
                  <>
                    <Card
                      bgColor="grey.825"
                      borderColor="#2B2927"
                      borderRadius={10}
                      w={{ base: 'full', xs: 'unset' }}
                      px={5}
                      py={{ base: 2, xs: 4 }}
                      borderWidth="1px"
                    >
                      <Text color="grey.500" fontSize={{ base: 12, xs: 'sm' }}>
                        Requesting a transaction from:
                      </Text>

                      <Divider borderColor="dark.100" mt={3} mb={5} />

                      <HStack width="100%" alignItems="center" spacing={4}>
                        <Avatar
                          variant="roundedSquare"
                          color="white"
                          bgColor="dark.150"
                          src={transaction.summary?.image}
                          name={transaction.summary?.name}
                          boxSize="40px"
                        />
                        <VStack alignItems="flex-start" spacing={0}>
                          <Text variant="subtitle" fontSize={14}>
                            {transaction.summary?.name}
                          </Text>
                          <Text
                            color="brand.500"
                            variant="description"
                            fontSize={{ base: 12, xs: 'unset' }}
                          >
                            {/* bakoconnector-git-gr-featbakosafe-infinity-base.vercel.app */}
                            {transaction.summary?.origin.split('//')[1]}
                          </Text>
                        </VStack>
                      </HStack>
                    </Card>
                  </>
                )}

                {isPending && notSigned && fromConnector && (
                  <>
                    <HStack
                      bg="warning.700"
                      borderColor="warning.700"
                      borderWidth="1px"
                      borderRadius={10}
                      mt={{ base: 4, xs: 8 }}
                      py={4}
                      px={8}
                    >
                      <Icon as={AlertIcon} color="warning.600" fontSize={28} />

                      <VStack spacing={0} alignItems="flex-start" ml={2}>
                        <Text
                          fontWeight="bold"
                          color="warning.600"
                          fontSize={{ base: 12, xs: 'unset' }}
                        >
                          Double check it!
                        </Text>
                        <Text
                          color="grey.200"
                          fontSize={{ base: 12, xs: 'unset' }}
                        >
                          Please carefully review this externally created
                          transaction before approving it.
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider borderColor="dark.100" mt={8} />
                  </>
                )}

                <Box
                  w="full"
                  hidden={transaction.status !== TransactionStatus.SUCCESS}
                  borderColor="grey.950"
                  borderTopWidth={1}
                  mt={fromConnector ? 4 : 0}
                >
                  <HStack
                    mt={2}
                    py={{ base: 3, sm: 5 }}
                    gap={8}
                    justifyContent="space-between"
                  >
                    <Text color="grey.75" fontSize="xs">
                      Gas Fee (ETH)
                    </Text>
                    <Text color="grey.75" fontSize="xs">
                      {isDeposit ? '+' : '-'}
                      {transaction.gasUsed}
                    </Text>
                  </HStack>
                </Box>
              </Box>

              <Box
                alignSelf="flex-start"
                w="full"
                minW={{ base: 200, md: 300 }}
                maxW={600}
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
        </CustomSkeleton>
      )}
    </DetailsTransactionStepper>
  );
};

export { Details };
