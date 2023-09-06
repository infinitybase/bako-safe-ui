import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import {
  MdChevronLeft,
  MdCopyAll as CopyIcon,
  MdGroup as GroupIcon,
  MdMonetizationOn as CoinIcon,
} from 'react-icons/md';

import { Loader } from '@/components';
import { AssetList, NativeAssetId, Pages, useVaultDetails } from '@/modules';

import { AssetItem } from '../../components';

const VaultDetailsPage = () => {
  const { vault, assets, navigate, account } = useVaultDetails();

  return (
    <Card mb={4} bg="dark.500" minW={600} boxShadow="xl" minH={550}>
      {vault.isLoading ? (
        <Loader h={500} w={400} />
      ) : (
        <>
          <CardHeader>
            <Flex hidden={vault.isLoading} width="100%" alignItems="center">
              <Box pt={2}>
                <Icon
                  onClick={() => navigate(Pages.home())}
                  cursor="pointer"
                  color="gray"
                  fontSize="4xl"
                  as={MdChevronLeft}
                />
              </Box>
              <Heading color="white" size="lg">
                {vault?.name}
              </Heading>
            </Flex>
            <Box mr={2} mt={2} maxW={500}>
              <Text fontSize="sm" color="gray">
                Add funds to your vault using the QRcode or the address and
                start making safer transactions. You can also see your pending
                signatures below and the old ones clicking in “Transactions”
              </Text>
            </Box>
          </CardHeader>

          <CardBody hidden={vault.isLoading}>
            <Flex mb={8}>
              <Flex
                p={5}
                mr={8}
                rounded="md"
                shadow="md"
                maxWidth="fit-content"
                direction="column"
                alignItems="center"
              >
                <QRCodeSVG
                  value={String(vault?.address)}
                  fgColor="#4D4D52FF"
                  bgColor="#191B20"
                  style={{ borderRadius: 5 }}
                />
                <Flex mt={2} alignItems="center">
                  <Box mr={1}>
                    <Text color="gray">
                      {String(vault?.address).slice(0, 4)}...
                      {String(vault?.address).slice(-10)}
                    </Text>
                  </Box>
                  <Icon
                    onClick={() =>
                      navigator.clipboard.writeText(vault?.address ?? '')
                    }
                    fontSize="md"
                    color="brand.500"
                    cursor="pointer"
                    as={CopyIcon}
                  />
                </Flex>
              </Flex>

              <Flex direction="column" justifyContent="center">
                <Box w="100%">
                  <Stat maxWidth="max-content">
                    <StatLabel color="white" fontSize="md">
                      Balance
                    </StatLabel>
                    <StatNumber color="white" fontSize="4xl">
                      ETH {assets.ethBalance}
                    </StatNumber>
                  </Stat>
                </Box>
                <Flex w="100%" mt={4} mb={2} justifyContent="center">
                  <Box mr={2}>
                    <Button
                      minW={100}
                      color="brand.900"
                      variant="solid"
                      colorScheme="brand"
                      onClick={() =>
                        navigate(
                          Pages.createTransaction({ id: String(vault?._id) }),
                        )
                      }
                      isDisabled={!vault.hasBalance}
                    >
                      Send
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      minW={100}
                      color="white"
                      bgColor="dark.100"
                      onClick={() =>
                        navigate(Pages.transactions({ id: String(vault?._id) }))
                      }
                      _hover={{}}
                      _active={{}}
                    >
                      Transactions
                    </Button>
                  </Box>
                </Flex>
              </Flex>
            </Flex>

            <Flex w="100%">
              <Box flex={1} mr={3}>
                <Flex alignItems="center" mb={4}>
                  <Icon mr={2} color="brand.500" as={CoinIcon} />
                  <Heading color="white" size="md">
                    Assets
                  </Heading>
                </Flex>
                {!assets.hasAssets && (
                  <AssetItem
                    name="Etherum"
                    slug="ETH"
                    amount={assets.ethBalance}
                    assetId={NativeAssetId}
                  />
                )}
                <AssetList assets={assets.value ?? []} />
              </Box>
              <Box flex={1}>
                <Flex alignItems="center" mb={4}>
                  <Icon mr={2} color="brand.500" as={GroupIcon} />
                  <Heading color="white" size="md">
                    Signers
                  </Heading>
                </Flex>
                {vault?.addresses?.map((address) => (
                  <Flex
                    key={vault._id + address}
                    justifyContent="space-between"
                    alignItems="center"
                    py={2}
                    px={3}
                    mb={2}
                    bg="dark.100"
                    borderRadius="md"
                  >
                    <Text color="white">
                      {String(address).slice(0, 4)}...
                      {String(address).slice(-10)}
                    </Text>
                    <Badge hidden={account !== address} colorScheme="brand">
                      You
                    </Badge>
                  </Flex>
                ))}
              </Box>
            </Flex>
          </CardBody>
        </>
      )}
    </Card>
  );
};

export { VaultDetailsPage };
