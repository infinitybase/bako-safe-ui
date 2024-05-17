import { CheckIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Heading,
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
import { ITransaction, TransactionStatus } from 'bakosafe';
import { Address } from 'fuels';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import {
  AlertIcon,
  CopyIcon,
  CustomSkeleton,
  DoubleArrowIcon,
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

type TransactionUI = Omit<ITransaction, 'assets'> & {
  assets: {
    assetId: string;
    amount: string;
    to: string;
    recipientNickname?: string;
  }[];
};
interface TransactionDetailsProps {
  transaction: TransactionUI;
  status?: TransactionState;
  isInTheVaultPage?: boolean;
}

interface AssetBoxInfoProps extends StackProps {
  asset?: AssetModel;
  contractAddress?: string;
  hasToken?: boolean;
}

const AssetBoxInfo = ({
  asset,
  contractAddress,
  hasToken,
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

  const contractWithoutToken = isContract && !hasToken;
  const nickname = asset?.recipientNickname;

  return (
    <HStack
      px={{ base: 0, md: 5 }}
      py={{ base: 3, sm: 5 }}
      spacing={{ base: 1, sm: 8 }}
      w="full"
      borderTopWidth={1}
      borderColor="transparent"
      {...props}
    >
      {contractWithoutToken ? (
        <Text
          fontWeight="semibold"
          color="grey.200"
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
                size={{ base: 'xs', sm: '28px' }}
                src={assetInfo.icon}
              />
              <Text color="grey.500">{assetInfo.slug}</Text>
            </HStack>
          )}

          <HStack>
            <Box mt={0.5} w={{ base: 120, sm: 140 }}>
              <Heading
                textAlign="center"
                variant={isMobile ? 'title-sm' : 'title-md'}
                color="grey.200"
              >
                {asset?.amount}
              </Heading>
              <Text
                textAlign="center"
                variant="description"
                fontSize={{ base: 'xs', sm: 'sm' }}
                color="grey.500"
              >
                Amount sent
              </Text>
            </Box>
          </HStack>
        </>
      )}

      <Center
        p={{ base: 1.5, sm: 3 }}
        borderRadius={5}
        bgColor={isContract ? 'brand.500' : 'grey.600'}
      >
        <Icon
          color={isContract ? 'black' : 'brand.500'}
          fontSize={{ base: 'md', sm: '2xl' }}
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
              color="grey.200"
              fontWeight="semibold"
              maxW={{ base: 100, sm: 220 }}
              isTruncated
            >
              {nickname}
            </Text>
          )}

          <Text
            maxW={{ base: 120, md: 200, lg: 250, '2xl': '100%' }}
            fontSize={{ base: 'xs', sm: 'md' }}
            color={nickname ? 'grey.500' : 'grey.200'}
            fontWeight={nickname ? 'regular' : 'bold'}
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
}: TransactionDetailsProps) => {
  const fromConnector = !!transaction?.summary;
  const mainOperation = transaction?.summary?.operations?.[0];
  const isContract = mainOperation?.to?.type === AddressType.contract;
  const hasToken = !!mainOperation?.assetsSent?.length;
  const isPending = transaction.status === TransactionStatus.AWAIT_REQUIREMENTS;
  const notSigned = !status?.isDeclined && !status?.isSigned;

  const handleViewInExplorer = async () => {
    const { hash } = transaction;
    window.open(
      `${import.meta.env.VITE_BLOCK_EXPLORER}/tx/0x${hash}`,
      '_BLANK',
    );
  };

  const { isOpen } = useAccordionItemState();

  if (!isOpen) return null;

  return (
    <DetailsTransactionStepper transactionId={transaction.id}>
      {(isLoading, transactionHistory) => (
        <CustomSkeleton isLoaded={!isLoading}>
          <VStack w="full">
            <Stack
              pt={{ base: 0, sm: 5 }}
              alignSelf="flex-start"
              display="flex"
              direction={{ base: 'column', md: 'row' }}
              // Voltar aqui e verificar o alinhamento entre transaction breakdown e history
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
                <Box mb={{ base: 2, sm: 4 }}>
                  <Text color="grey.200" fontWeight="medium">
                    Transaction breakdown
                  </Text>
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
                      h={{ base: 114, xs: 'unset' }}
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

                <VStack alignItems="flex-start" flexWrap="wrap" w="100%">
                  {transaction.assets.map((asset, index) => (
                    <AssetBoxInfo
                      key={index}
                      asset={{
                        assetId: asset.assetId,
                        amount: asset.amount,
                        to: asset.to,
                        transactionID: transaction.id,
                        recipientNickname: asset?.recipientNickname,
                      }}
                      borderColor={index > 0 ? 'grey' : 'transparent'}
                      hasToken={hasToken}
                    />
                  ))}
                  {isContract && !transaction.assets.length && (
                    <AssetBoxInfo
                      contractAddress={Address.fromB256(
                        mainOperation.to?.address ?? '',
                      ).toString()}
                      borderColor={'transparent'}
                      hasToken={hasToken}
                    />
                  )}
                </VStack>

                <Box
                  w="full"
                  mt={
                    fromConnector &&
                    transaction.status === TransactionStatus.SUCCESS
                      ? 0
                      : 10
                  }
                  hidden={transaction.status !== TransactionStatus.SUCCESS}
                  borderColor="grey"
                  borderTopWidth={1}
                >
                  <HStack
                    mt={2}
                    px={{ base: 0, sm: 5 }}
                    py={{ base: 3, sm: 5 }}
                    gap={8}
                    justifyContent="space-between"
                  >
                    <Text color="grey.200">Gas Fee (ETH)</Text>
                    <Text
                      color="grey.200"
                      fontSize={{ base: 'md', sm: 'lg' }}
                      fontWeight="semibold"
                    >
                      -{transaction.gasUsed}
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
                {/* {isOpen && (
            <DetailsTransactionStepper transactionId={transaction.id!} />
          )} */}
              </Box>
            </Stack>

            {transaction.status === TransactionStatus.SUCCESS && (
              <Button
                border="1px solid white"
                bgColor="transparent"
                _hover={{
                  borderColor: 'brand.500',
                  color: 'brand.500',
                }}
                alignSelf={{ base: 'stretch', sm: 'flex-end' }}
                variant="secondary"
                onClick={handleViewInExplorer}
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
