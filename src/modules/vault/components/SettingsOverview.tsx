import {
  Avatar,
  Box,
  Button,
  Center,
  Grid,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import { FiEye as ViewIcon, FiEyeOff as ViewOffIcon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import {
  AddressWithCopyBtn,
  Card,
  CommingSoonDialog,
  CustomSkeleton,
} from '@/components';
import { CLISettingsCard } from '@/modules/cli/components';
import { CreateAPITokenDialog } from '@/modules/cli/components/APIToken/create';
import { Pages, PermissionRoles } from '@/modules/core';
import { useNetworks } from '@/modules/network/hooks';
import { NetworkType } from '@/modules/network/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { limitCharacters } from '@/utils';

import { UseVaultDetailsReturn } from '../hooks/details';
import { openFaucet } from '../utils';
import { useVaultInfosContext } from '../VaultInfosProvider';

export interface CardDetailsProps {
  assets: UseVaultDetailsReturn['assets'];
  vault: UseVaultDetailsReturn['vault'];
  blockedTransfers: boolean;
  setAddAssetsDialogState: (state: boolean) => void;
}

const SettingsOverview = (props: CardDetailsProps): JSX.Element | null => {
  const navigate = useNavigate();
  const { vault, assets, blockedTransfers, setAddAssetsDialogState } = props;
  const { balanceUSD, isEthBalanceLowerThanReservedAmount } = assets;
  const { checkNetwork } = useNetworks();

  const isTestnet = checkNetwork(NetworkType.TESTNET);

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { hasPermission },
    },
    screenSizes: { isExtraSmall, vaultRequiredSizeToColumnLayout, isLarge },
  } = useWorkspaceContext();

  const {
    CLIInfos: {
      CLISettings,
      APIToken,
      commingSoonFeatures: { commingSoonDialog, selectedFeature },
    },
  } = useVaultInfosContext();
  const { dialog, steps, tabs, create, list } = APIToken;

  const workspaceId = userInfos.workspace?.id ?? '';

  const reqPerm = [
    PermissionRoles.ADMIN,
    PermissionRoles.OWNER,
    PermissionRoles.MANAGER,
    PermissionRoles.SIGNER,
  ];
  const makeTransactionsPerm = useMemo(() => {
    const as = hasPermission(reqPerm);
    return as;
  }, [vault.data?.id]);

  if (!vault) return null;

  return (
    <>
      <Box w="full">
        <Box mb={5} w="full">
          <Text color="grey.50" fontWeight="bold" fontSize="sm">
            Settings
          </Text>
        </Box>

        <Grid
          gap={10}
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(1, 1fr)',
            lg: vaultRequiredSizeToColumnLayout ? '2fr 1fr' : 'repeat(1, 1fr)',
            xl: isLarge ? 'repeat(1, 1fr)' : '3fr 1fr',
          }}
        >
          <CustomSkeleton loading={vault.isLoading} w="full">
            <Card
              p={{ base: 4, sm: 8 }}
              bg="gradients.transaction-card"
              backdropFilter="blur(6px)"
              position="relative"
              borderColor="gradients.transaction-border"
              boxShadow="lg"
            >
              <Stack direction={{ base: 'column', sm: 'row' }}>
                <VStack
                  gap={{ base: 6, sm: 9 }}
                  w="full"
                  pr={{ base: 0, sm: 3 }}
                  justifyContent="space-between"
                >
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    alignItems={{ base: 'flex-start', sm: 'center' }}
                    gap={{ base: 3, sm: 6 }}
                    w="full"
                    maxW={{ base: 'full', sm: '100%' }}
                  >
                    <Center>
                      <Avatar.Root
                        bg="grey.900"
                        color="white"
                        size={'lg'}
                        p={{ base: 10, sm: 10 }}
                      >
                        <Avatar.Fallback name={vault.data?.name} />
                      </Avatar.Root>
                    </Center>
                    <Box maxW="59%">
                      <Heading
                        mb={1}
                        // variant="title-xl"
                        fontSize={{ base: 'md', sm: 'xl' }}
                        truncate
                        maxW={{ base: 250, sm: 400, md: 350, lg: 350 }}
                      >
                        {isExtraSmall
                          ? limitCharacters(vault.data?.name ?? '', 10)
                          : vault.data?.name}
                      </Heading>

                      <Box maxW={420}>
                        <Text
                          maxW={{ base: '110px', sm: 'unset' }}
                          // variant="description"
                          truncate
                          textOverflow="ellipsis"
                        >
                          {vault?.data?.description}
                        </Text>
                      </Box>
                    </Box>
                  </Stack>

                  <VStack w="full" gap={5}>
                    <Box w="full" maxW="full">
                      <Stack
                        justifyContent={{
                          base: 'flex-start',
                          sm: 'space-between',
                        }}
                        alignItems={{ base: 'flex-start', sm: 'center' }}
                        direction={{ base: 'column', sm: 'row' }}
                        mb={2}
                      >
                        <Text
                          // variant="description"
                          maxW={{ base: 20, sm: 'unset' }}
                          lineClamp={2}
                        >
                          Vault balance
                        </Text>
                        <HStack gap={2}>
                          <HStack gap={2}>
                            <Heading
                              // variant="title-xl"
                              fontSize={{ base: 'md', sm: 'lg' }}
                            >
                              {assets.visibleBalance
                                ? `${balanceUSD} USD`
                                : '-----'}
                            </Heading>
                          </HStack>
                          <Box
                            display="flex"
                            width="18%"
                            justifyContent="center"
                            alignItems="center"
                            onClick={() =>
                              assets.setVisibleBalance(!assets.visibleBalance)
                            }
                          >
                            {assets.visibleBalance ? (
                              <Icon
                                as={ViewIcon}
                                boxSize={{ base: 5, sm: 6 }}
                              />
                            ) : (
                              <Icon
                                as={ViewOffIcon}
                                boxSize={{ base: 5, sm: 6 }}
                              />
                            )}
                          </Box>
                        </HStack>
                      </Stack>
                    </Box>

                    <HStack
                      w="full"
                      justifySelf="end"
                      gap={{ base: 8, sm: 40 }}
                      borderTopWidth={'1px'}
                      borderTopColor={'dark.100'}
                      justifyContent={'flex-start'}
                      pt={4}
                    >
                      <VStack w="full" gap={2} alignItems="flex-start">
                        <Button
                          minW={isExtraSmall ? 110 : { base: 125, sm: 130 }}
                          // variant="primary"
                          onClick={() =>
                            isTestnet
                              ? openFaucet(vault.data?.predicateAddress)
                              : setAddAssetsDialogState(true)
                          }
                          position="relative"
                        >
                          {isTestnet ? 'Faucet' : 'Add Assets'}
                        </Button>
                        <Text
                          // variant="description"
                          fontSize="xs"
                          position={{ base: 'unset', sm: 'absolute' }}
                          bottom={{ base: -1, sm: 2 }}
                        >
                          Use the faucet to add assets to the vault
                        </Text>
                      </VStack>

                      <VStack
                        w="full"
                        gap={0}
                        alignSelf={{ base: 'flex-start', sm: 'unset' }}
                        alignItems={'flex-end'}
                      >
                        <Button
                          minW={isExtraSmall ? 110 : { base: 125, sm: 130 }}
                          colorPalette="primary"
                          alignSelf="end"
                          position={'relative'}
                          disabled={
                            !assets?.hasBalance ||
                            blockedTransfers ||
                            !makeTransactionsPerm ||
                            isEthBalanceLowerThanReservedAmount
                          }
                          onClick={() =>
                            navigate(
                              Pages.createTransaction({
                                vaultId: vault.data?.id,
                                workspaceId,
                              }),
                            )
                          }
                        >
                          Send
                        </Button>

                        {isEthBalanceLowerThanReservedAmount &&
                          !blockedTransfers && (
                            <Text
                              // variant="description"
                              textAlign={isExtraSmall ? 'left' : 'right'}
                              fontSize="xs"
                              flex={1}
                              mt={2}
                              color="error.500"
                              position={{ base: 'unset', sm: 'absolute' }}
                              bottom={{ base: -1, sm: 2 }}
                            >
                              Not enough balance.
                            </Text>
                          )}

                        {blockedTransfers ? (
                          <Text
                            // variant="description"
                            textAlign={isExtraSmall ? 'left' : 'right'}
                            fontSize="xs"
                            flex={1}
                            mt={2}
                            color="error.500"
                            position={{ base: 'unset', sm: 'absolute' }}
                            bottom={{ base: -1, sm: 2 }}
                          >
                            Pending transactions
                          </Text>
                        ) : !makeTransactionsPerm ? (
                          <Text
                            // variant="description"
                            textAlign={isExtraSmall ? 'left' : 'right'}
                            fontSize="xs"
                            flex={1}
                            mt={2}
                            color="error.500"
                            position={{ base: 'unset', sm: 'absolute' }}
                            bottom={{ base: -1, sm: 2 }}
                          >
                            {`You don't have permission to send transactions.`}
                          </Text>
                        ) : (
                          <Text
                            hidden={true}
                            // variant="description"
                            fontSize="xs"
                          >
                            Send single or batch <br /> payments with multi
                            assets.
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </VStack>
                </VStack>

                <VStack
                  position={{ base: 'absolute', sm: 'relative' }}
                  top={{ base: 4, sm: 0 }}
                  right={{ base: 4, sm: 0 }}
                  align={{ base: 'flex-end', sm: 'center' }}
                  justifyContent="flex-start"
                >
                  <Box
                    p={3}
                    backgroundColor={'white'}
                    w={{ base: 32, sm: 180 }}
                    h={{ base: 32, sm: 180 }}
                    borderRadius={10}
                  >
                    <QRCodeSVG
                      value={vault?.data?.predicateAddress}
                      fgColor="black"
                      bgColor="white"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                      }}
                    />
                  </Box>
                  <AddressWithCopyBtn
                    mt="auto"
                    value={vault?.data?.predicateAddress ?? ''}
                    p={2}
                    px={3}
                    flexDir="row-reverse"
                    cursor="pointer"
                    borderRadius={10}
                    backgroundColor="dark.100"
                    isSidebarAddress
                    textProps={{ color: 'grey.500' }}
                  />
                </VStack>
              </Stack>
            </Card>
          </CustomSkeleton>

          <CustomSkeleton loading={vault.isLoading}>
            <Grid
              gap={2}
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                md: '1fr',
                lg: vaultRequiredSizeToColumnLayout
                  ? 'repeat(1, 1fr)'
                  : 'repeat(2, 1fr)',
                xl: isLarge ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
              }}
            >
              {CLISettings.map((setting) => (
                <CLISettingsCard
                  key={setting.label}
                  onClick={setting.onClick}
                  icon={setting.icon}
                  label={setting.label}
                  aria-label={setting.label}
                  disabled={setting.disabled}
                />
              ))}
            </Grid>
          </CustomSkeleton>
        </Grid>
      </Box>

      <CreateAPITokenDialog
        control={dialog}
        steps={steps}
        tabs={tabs}
        create={create}
        list={list}
      />

      {selectedFeature && (
        <CommingSoonDialog
          description={selectedFeature.dialogDescription}
          isOpen={commingSoonDialog.open}
          onClose={commingSoonDialog.onClose}
          notifyHandler={selectedFeature.notifyHandler}
          title="Coming Soon"
        />
      )}
    </>
  );
};

export { SettingsOverview };
