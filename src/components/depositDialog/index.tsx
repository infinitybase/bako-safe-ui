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

import { AddressUtils, PredicateAndWorkspace } from '@/modules';
import { openFaucet } from '@/modules/vault/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { ENetworks } from '@/utils/constants';

import { AddressWithCopyBtn } from '../addressWithCopyButton';
import { Dialog } from '../dialog';

interface IDepositDialogProps {
  vault: PredicateAndWorkspace;
  isOpen: boolean;
  setIsDepositDialogOpen: (value: boolean) => void;
}

const DepositDialog = ({
  vault,
  isOpen,
  setIsDepositDialogOpen,
}: IDepositDialogProps) => {
  const {
    screenSizes: {
      isMobile,
      screenWidths: {
        isSmallerThan336,
        isSmallerThan400,
        isSmallerThan600,
        isSmallerThan430,
      },
    },
  } = useWorkspaceContext();

  const isPredicateFromTestNet = vault.provider === ENetworks.TEST_NET;

  return (
    <Dialog.Modal
      onClose={() => setIsDepositDialogOpen(false)}
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size={{ base: 'full', xs: 'md' }}
      modalContentProps={{
        px: 10,
        py: 10,
      }}
    >
      <Dialog.Body>
        <Dialog.Header
          mt={0}
          mb={0}
          onClose={() => setIsDepositDialogOpen(false)}
          w="full"
          maxW={{ base: 480, xs: 'unset' }}
          title={''}
          description={''}
        />

        <VStack w="full" mt={6} mb={4} spacing={isMobile ? 6 : 10}>
          <Box
            boxSize={isMobile ? '190px' : '220px'}
            p={2}
            bg="white"
            borderRadius={10}
          >
            <QRCodeSVG
              value={vault?.predicateAddress}
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
          <VStack spacing={6}>
            <Text color="grey.75" fontWeight={700} fontSize="20px">
              Receive Assets
            </Text>

            <Text
              color="grey.250"
              fontWeight={400}
              fontSize="xs"
              lineHeight="16.8px"
            >
              Use this address for receiving tokens on Fuel Network
            </Text>
          </VStack>

          <HStack h="40px" mb={6} spacing={4} w="full">
            <Avatar
              name={vault?.name ?? ''}
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
                maxW={{ base: isSmallerThan336 ? 82 : 140, xs: 320 }}
              >
                {vault?.name}
              </Heading>

              <AddressWithCopyBtn
                h="18px"
                address={vault.predicateAddress}
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
                  vault.predicateAddress ?? '',
                  isSmallerThan336
                    ? 17
                    : isSmallerThan400
                      ? 24
                      : isSmallerThan430
                        ? 30
                        : 35,
                )}
              />
            </VStack>
          </HStack>
        </VStack>

        <Dialog.Actions
          position={isMobile ? 'absolute' : 'relative'}
          bottom={0}
          pb={isMobile && !isSmallerThan600 ? 5 : 'unset'}
          borderRadius={isMobile && !isSmallerThan600 ? '20px' : 'unset'}
          left={0}
          right={0}
          px={isMobile ? 10 : 'unset'}
          bg={isMobile ? 'dark.950' : 'unset'}
          sx={{
            '&>hr': {
              display: 'none',
            },
          }}
        >
          {isPredicateFromTestNet && (
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
              onClick={() => openFaucet(vault.predicateAddress)}
            >
              Faucet
            </Button>
          )}
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export default DepositDialog;
