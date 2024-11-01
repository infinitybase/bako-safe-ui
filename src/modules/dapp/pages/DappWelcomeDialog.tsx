import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

import {
  AddressWithCopyBtn,
  BridgeIcon,
  CoinsIcon,
  Dialog,
  DownLeftArrow,
} from '@/components';
import WelcomeCard from '@/components/welcomeDialog/card';
import { useQueryParams } from '@/modules';
import { AddressUtils } from '@/modules/core';
import { NetworkType } from '@/modules/network/services';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { openFaucet } from '@/modules/vault/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useAuthSocket } from '../hooks';

const DappWelcomeDialog = () => {
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(true);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  const { name, origin, sessionId, request_id } = useQueryParams();
  const { send } = useAuthSocket();

  const {
    screenSizes: { isMobile, isSmall, isExtraSmall },
    authDetails: {
      userInfos: { id, first_login, address },
    },
    userVaults: {
      request: { vaults },
    },

    checkNetwork,
  } = useWorkspaceContext();

  const updateUserMutation = useUpdateSettingsRequest();

  const handleOpenDepositDialog = () => {
    setIsDepositDialogOpen(true);
    setIsWelcomeDialogOpen(false);
  };

  const handleRedirectToMainNet = async () => {
    window.open(import.meta.env.VITE_BRIDGE, '_BLANK');
  };

  const isTestnet = checkNetwork(NetworkType.TESTNET);

  useEffect(() => {
    if (first_login) {
      updateUserMutation.mutate({ id, first_login: false });

      if (
        vaults[0]?.id &&
        !send.isPending &&
        name &&
        origin &&
        sessionId &&
        request_id &&
        address
      ) {
        send.mutate({
          name: name,
          origin: origin,
          sessionId: sessionId,
          request_id: request_id,
          vaultId: vaults[0].id,
          userAddress: address,
        });
      }
    }
  }, []);

  return (
    <>
      <Dialog.Modal
        onClose={() => {
          setIsDepositDialogOpen(false);
          setIsWelcomeDialogOpen(true);
        }}
        isOpen={isDepositDialogOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size={{ base: 'full', xs: 'md' }}
        modalContentProps={{ px: 10, py: 10 }}
      >
        <Dialog.Body>
          <Dialog.Header
            mt={0}
            mb={0}
            onClose={() => {
              setIsDepositDialogOpen(false);
              setIsWelcomeDialogOpen?.(true);
            }}
            w="full"
            maxW={{ base: 480, xs: 'unset' }}
            title={''}
            description={''}
            descriptionFontSize="12px"
            titleSxProps={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '19.36px',
            }}
          />

          <VStack
            w="full"
            mt={isMobile ? 20 : 6}
            mb={4}
            spacing={isMobile ? 6 : 10}
          >
            <Box
              boxSize={isMobile ? '190px' : '220px'}
              p={2}
              bg="white"
              borderRadius={10}
            >
              <QRCodeSVG
                value={vaults[0]?.predicateAddress}
                fgColor="black"
                bgColor="white"
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid white',
                  borderRadius: 10,
                }}
              />
            </Box>
            <VStack spacing={4} mt={isMobile ? 4 : 'unset'}>
              <Text color="grey.75" fontWeight={700} fontSize="20px">
                Receive Assets
              </Text>

              <Text
                color="grey.250"
                fontWeight={400}
                fontSize="xs"
                lineHeight="16.8px"
                textAlign={'center'}
              >
                {
                  'This is the address of your Safe Account. Deposit funds by scanning the QR code or copying the address below. Only send XDAI and tokens (e.g. ERC20, ERC721) to this address.'
                }
              </Text>
            </VStack>
          </VStack>

          <Dialog.Actions
            position={isMobile ? 'absolute' : 'relative'}
            bottom={isMobile ? 10 : 0}
            pb={isMobile && !isSmall ? 5 : 'unset'}
            borderRadius={isMobile && !isSmall ? '20px' : 'unset'}
            left={0}
            right={0}
            px={isMobile ? 10 : 'unset'}
            bg={isMobile ? 'dark.950' : 'unset'}
            sx={{ '&>hr': { display: 'none' } }}
          >
            <VStack w="full">
              <HStack h="40px" mb={10} mt={6} spacing={4} w="full">
                <Avatar
                  name={vaults[0]?.name ?? ''}
                  color="grey.75"
                  bgColor="grey.925"
                  boxSize="40px"
                  borderRadius="4px"
                  sx={{
                    '&>div': {
                      fontSize: '14px',
                    },
                  }}
                />
                <VStack alignItems="start" w="full">
                  <Heading
                    fontSize="xs"
                    color="#F5F5F5"
                    lineHeight="14.52px"
                    textOverflow="ellipsis"
                    textAlign="left"
                    noOfLines={1}
                    maxW={{ base: isExtraSmall ? 82 : 140, xs: 320 }}
                  >
                    {vaults[0]?.name}
                  </Heading>

                  <AddressWithCopyBtn
                    h="18px"
                    address={vaults[0].predicateAddress}
                    flexDir="row-reverse"
                    gap="4px"
                    alignItems="center"
                    addressProps={{
                      textAlign: 'start',
                      maxW: 'full',
                      wordBreak: 'break-all',
                      noOfLines: 1,
                      isTruncated: false,
                      fontSize: 'xs',
                    }}
                    justifyContent="start"
                    customAddress={AddressUtils.format(
                      vaults[0].predicateAddress ?? '',
                      10,
                    )}
                  />
                </VStack>
              </HStack>
              {isTestnet && (
                <Button
                  fontSize="14px"
                  lineHeight="15.85px"
                  letterSpacing=".5px"
                  variant="outline"
                  color="dark.950"
                  bg="grey.75"
                  fontWeight={600}
                  _hover={{ bg: 'grey.75' }}
                  w="full"
                  onClick={() => openFaucet(vaults[0].predicateAddress)}
                >
                  Faucet
                </Button>
              )}
            </VStack>
          </Dialog.Actions>
        </Dialog.Body>
      </Dialog.Modal>

      {/* WELCOME DIALOG */}
      <Dialog.Modal
        onClose={() => {}}
        isOpen={isWelcomeDialogOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size={{ base: 'full', xs: 'lg' }}
        modalContentProps={{ px: 10, py: 10 }}
      >
        <Dialog.Body>
          <Dialog.Header
            mt={0}
            mb={0}
            w="full"
            maxW={{ base: 480, xs: 'unset' }}
            title="Welcome to Bako Safe!"
            description={`Let's start by adding some funds to your personal vault.`}
            descriptionFontSize={'12px'}
            titleSxProps={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '19.36px',
            }}
            borderBottomWidth={1}
            borderColor="grey.425"
            hideCloseButton={true}
          />

          <VStack w="full" my={6} pb={isMobile ? 8 : 0} spacing={4}>
            <WelcomeCard
              title="Bridge on Fuel Bridge"
              description="Transfer crypto from ETH to Fuel mainnet."
              icon={BridgeIcon}
              onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
              commingSoon={isTestnet}
            />
            {/* <WelcomeCard
              title="Bridge on Orbiter Finance"
              description="Transfer crypto from other chains to Fuel mainnet."
              icon={BridgeIcon}
              commingSoon={true}
              // onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
            /> */}
            <WelcomeCard
              title="Deposit"
              description="Deposit crypto using QR Code or vault address (Fuel only)."
              icon={DownLeftArrow}
              iconSize="22px"
              onClick={() => handleOpenDepositDialog()}
            />
            <WelcomeCard
              title="Purchase"
              description="Buy crypto using card or bank account."
              icon={CoinsIcon}
              iconSize="22px"
              commingSoon
            />
          </VStack>

          <Dialog.Actions
            position={isMobile ? 'absolute' : 'relative'}
            bottom={isMobile ? 10 : 0}
            left={0}
            right={0}
            px={isMobile ? 10 : 'unset'}
            bg={isMobile ? 'dark.950' : 'unset'}
            borderRadius={isMobile && !isSmall ? '20px' : 'unset'}
            pb={isMobile && !isSmall ? 5 : 'unset'}
            sx={{
              '&>hr': {
                marginTop: '0',
                borderColor: '#868079',
              },
            }}
          >
            <Button
              w="full"
              variant="primary"
              _hover={{ opacity: 0.8 }}
              fontWeight={600}
              fontSize={14}
              onClick={() => {
                window.open(`${window.location.origin}/home`, '_BLANK');
              }}
              mt={2}
            >
              Manage your Bako Safe
            </Button>
          </Dialog.Actions>
        </Dialog.Body>
      </Dialog.Modal>
    </>
  );
};

export { DappWelcomeDialog };
