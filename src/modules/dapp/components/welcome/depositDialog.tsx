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

import { AddressWithCopyBtn, Dialog } from '@/components';
import { AddressUtils } from '@/modules/core';
import { NetworkType } from '@/modules/network/services';
import { openFaucet } from '@/modules/vault/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

type WelcomeDepositDialogProps = {
  setIsDepositDialogOpen: (value: boolean) => void;
  setIsWelcomeDialogOpen: (value: boolean) => void;
  isDepositDialogOpen: boolean;
};

const WelcomeDepositDialog = ({
  setIsDepositDialogOpen,
  setIsWelcomeDialogOpen,
  isDepositDialogOpen,
}: WelcomeDepositDialogProps) => {
  const {
    screenSizes: { isMobile, isSmall, isExtraSmall },
    userVaults: {
      request: { vaults },
    },
    checkNetwork,
  } = useWorkspaceContext();

  const isTestnet = checkNetwork(NetworkType.TESTNET);

  return (
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
  );
};

export { WelcomeDepositDialog };
