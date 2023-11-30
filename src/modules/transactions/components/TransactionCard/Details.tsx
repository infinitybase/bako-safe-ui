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
  StackProps,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import { ITransaction, TransactionStatus } from 'bsafe';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';

import { AlertIcon, CopyIcon, DoubleArrowIcon } from '@/components';
import { AddressUtils, AssetModel, assetsMap } from '@/modules/core';
import { useNotification } from '@/modules/notification';

interface TransactionDetailsProps {
  transaction: ITransaction;
}

interface AssetBoxInfoProps extends StackProps {
  asset: AssetModel;
  isContract?: boolean;
  hasToken?: boolean;
}

const AssetBoxInfo = ({
  asset,
  hasToken,
  isContract,
  ...props
}: AssetBoxInfoProps) => {
  const toast = useNotification();
  const clipboard = useClipboard(asset.to);
  const assetInfo = useMemo(() => assetsMap[asset.assetId], [asset.assetId]);

  if (!assetInfo) return null;

  return (
    <HStack
      p={5}
      spacing={8}
      w="full"
      borderTopWidth={1}
      borderColor="transparent"
      {...props}
    >
      {!isContract ||
        (hasToken ? (
          <>
            <HStack spacing={4}>
              <Avatar name={assetInfo.slug} size="28px" src={assetInfo.icon} />
              <Text color="grey.500">{assetInfo.slug}</Text>
            </HStack>

            <HStack>
              <Box mt={0.5} w={110}>
                <Heading textAlign="center" variant="title-md" color="grey.200">
                  - {asset?.amount}
                </Heading>
                <Text
                  textAlign="center"
                  variant="description"
                  fontSize="sm"
                  color="grey.500"
                >
                  Amount sent
                </Text>
              </Box>
            </HStack>
          </>
        ) : (
          <Text fontWeight="semibold" color="grey.200">
            Contract execution
          </Text>
        ))}

      <Center
        p={3}
        borderRadius={5}
        bgColor={isContract ? 'grey.900' : 'brand.500'}
      >
        <Icon
          color={isContract ? 'grey.200' : 'black'}
          fontSize="xs"
          as={isContract ? FaPlay : DoubleArrowIcon}
        />
      </Center>

      {isContract && (
        <VStack spacing={0} alignItems="flex-end">
          <HStack spacing={3}>
            <Text color="grey.200" fontSize="md" ml={1}>
              {AddressUtils.format(asset.to, 8)}
            </Text>
            <Icon
              color="grey.500"
              fontSize="sm"
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

      {!isContract && (
        <Text color="grey.200" fontSize="md">
          {asset.recipientNickname ?? AddressUtils.format(asset.to)}
        </Text>
      )}
    </HStack>
  );
};

const Details = ({ transaction }: TransactionDetailsProps) => {
  // TODO: Remove this when task is completed
  transaction.summary = {
    name: 'Transaction Name',
    origin: 'http://localhost:5173',
  };

  const fromConnector = transaction?.summary;
  const isPending = transaction.status === TransactionStatus.AWAIT_REQUIREMENTS;

  const handleViewInExplorer = async () => {
    const resume = transaction.resume;
    //window.open(resume.block, '_BLANK');
  };

  return (
    <VStack>
      <HStack pt={5} w="full">
        <Box hidden={!transaction?.assets?.length}>
          <Box mb={4}>
            <Text color="grey.200" fontWeight="medium">
              Transaction breakdown
            </Text>
          </Box>

          {fromConnector && (
            <>
              <Card
                // bgColor="dark.300"
                bgColor={isPending ? 'warning.800' : 'dark.300'}
                // borderColor="dark.100"
                borderColor={isPending ? 'warning.500' : 'dark.100'}
                borderRadius={10}
                px={5}
                py={4}
                borderWidth="1px"
              >
                <Text fontSize="sm" color="grey.500">
                  Requesting a transaction from:
                </Text>

                <Divider borderColor="dark.100" mt={3} mb={5} />

                <HStack width="100%" alignItems="center" spacing={4}>
                  <Avatar
                    variant="roundedSquare"
                    color="white"
                    bgColor="dark.150"
                    src={transaction.summary.image}
                    name={transaction.summary.name}
                  />
                  <VStack alignItems="flex-start" spacing={0}>
                    <Text variant="subtitle">{transaction.summary.name}</Text>
                    <Text color="brand.500" variant="description">
                      {transaction.summary.origin.split('//')[1]}
                    </Text>
                  </VStack>
                </HStack>
              </Card>
            </>
          )}

          {isPending && (
            <>
              <HStack
                bg="warning.700"
                borderColor="warning.700"
                borderWidth="1px"
                borderRadius={10}
                mt={8}
                py={4}
                px={8}
              >
                <Icon as={AlertIcon} color="warning.600" fontSize={28} />

                <VStack spacing={0} alignItems="flex-start" ml={2}>
                  <Text fontWeight="bold" color="warning.600">
                    Double check it!
                  </Text>
                  <Text color="grey.200">
                    When I hear the buzz of the little world...
                  </Text>
                </VStack>
              </HStack>

              <Divider borderColor="dark.100" mt={8} />
            </>
          )}

          <VStack alignItems="flex-start">
            {transaction.assets.map((asset, index) => (
              <AssetBoxInfo
                key={index}
                asset={{
                  assetId: asset.assetId,
                  amount: asset.amount,
                  to: asset.to,
                  transactionID: transaction.id,
                }}
                borderColor={index > 0 ? 'dark.100' : 'transparent'}
                // TODO: Add dynamic values
                isContract={true}
                hasToken={true}
              />
            ))}
          </VStack>

          <Divider borderColor="dark.100" />

          <Box
            mt={10}
            hidden={transaction.status !== TransactionStatus.SUCCESS}
            borderColor="dark.100"
            borderTopWidth={1}
          >
            <HStack mt={2} p={5} justifyContent="space-between">
              <Text color="grey.200">Gás Fee (ETH)</Text>
              <Text color="grey.200" fontSize="lg" fontWeight="semibold">
                -{transaction.gasUsed}
              </Text>
            </HStack>
          </Box>
        </Box>
      </HStack>
      <Button
        border="none"
        bgColor="dark.100"
        variant="secondary"
        onClick={handleViewInExplorer}
        hidden={transaction.status !== TransactionStatus.SUCCESS}
      >
        View on Explorer
      </Button>
    </VStack>
  );
};

export { Details };
