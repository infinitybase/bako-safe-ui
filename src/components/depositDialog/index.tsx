import {
  Avatar,
  Box,
  Button,
  DialogOpenChangeDetails,
  Heading,
  HStack,
  Text,
  VStack,
} from 'bako-ui';
import { QRCodeSVG } from 'qrcode.react';

import { AddressUtils, PredicateAndWorkspace } from '@/modules';
import { openFaucet } from '@/modules/vault/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { ENetworks } from '@/utils/constants';

import { AddressWithCopyBtn } from '../address/copy';
import { Dialog } from '../dialog';

interface IDepositDialogProps {
  vault: PredicateAndWorkspace;
  isOpen: boolean;
  onOpenChange: (isOpen: DialogOpenChangeDetails) => void;
}

const DepositDialog = ({
  vault,
  isOpen,
  onOpenChange,
}: IDepositDialogProps) => {
  const {
    screenSizes: {
      isMobile,
      isExtraSmall,
      isLitteSmall,
      isSmall,
      isLowerThanFourHundredAndThirty,
    },
  } = useWorkspaceContext();

  const isPredicateFromTestNet = vault.provider === ENetworks.TEST_NET;

  return (
    <Dialog.Modal
      onOpenChange={onOpenChange}
      open={isOpen}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      size={{ base: 'full', sm: 'md' }}
      modalContentProps={{
        px: 10,
        py: 10,
      }}
    >
      <Dialog.Body>
        <Dialog.Header
          mt={0}
          mb={0}
          onClose={() => onOpenChange({ open: false })}
          w="full"
          maxW={{ base: 480, sm: 'unset' }}
          title={''}
          description={''}
          descriptionFontSize="12px"
          titleSxProps={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '19.36px',
          }}
        />

        <VStack w="full" mt={6} mb={4} gap={isMobile ? 6 : 10}>
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
          <VStack gap={6}>
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

          <HStack h="40px" mb={6} gap={4} w="full">
            <Avatar
              color="grey.75"
              bgColor="grey.925"
              boxSize="40px"
              borderRadius="4px"
              name={vault.name ?? ''}
              css={{
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
                lineClamp={1}
                maxW={{ base: isExtraSmall ? 82 : 140, sm: 320 }}
              >
                {vault?.name}
              </Heading>

              <AddressWithCopyBtn
                h="18px"
                value={vault.predicateAddress}
                flexDir="row-reverse"
                gap="4px"
                alignItems="center"
                textProps={{
                  textAlign: 'start',
                  maxW: 'full',
                  wordBreak: 'break-all',
                  lineClamp: 1,
                  truncate: false,
                  fontSize: 'xs',
                }}
                justifyContent="start"
                customValue={AddressUtils.format(
                  vault.predicateAddress ?? '',
                  isExtraSmall
                    ? 17
                    : isLitteSmall
                      ? 24
                      : isLowerThanFourHundredAndThirty
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
          pb={isMobile && !isSmall ? 5 : 'unset'}
          borderRadius={isMobile && !isSmall ? '20px' : 'unset'}
          left={0}
          right={0}
          px={isMobile ? 10 : 'unset'}
          bg={isMobile ? 'dark.950' : 'unset'}
          hideDivider
          css={{
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
              fontWeight={600}
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
