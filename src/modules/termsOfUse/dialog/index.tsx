import { Box, HStack, Separator, Text, VStack } from 'bako-ui';
import { useMemo } from 'react';

import { Dialog } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useTermsDialog } from '../hooks/useTermsDialog';
import { privacyPolicy, termsOfUse } from '../utils/data';

type TermsOfUseDialogProps = {
  actionHandler: () => void;
};

const TermsOfUseDialog = (props: TermsOfUseDialogProps) => {
  const {
    screenSizes: {
      screenHeights: {
        isLargerThan600,
        isLargerThan660,
        isLargerThan768,
        isLargerThan900,
      },
    },
  } = useWorkspaceContext();
  const {
    isSafariBrowser,
    isMobile,
    read,
    inView,
    handleClose,
    modalIsOpen,
    onOpenChange,
  } = useTermsDialog();

  const textHeight = useMemo(() => {
    if (isMobile) {
      if (isLargerThan900) return 600;
      if (isLargerThan768) return 460;
      if (isLargerThan660) return 340;
      if (isLargerThan600) return 300;
      return 200;
    }
    return 420;
  }, [
    isLargerThan600,
    isLargerThan660,
    isLargerThan768,
    isLargerThan900,
    isMobile,
  ]);

  return (
    <Dialog.Modal
      size={{ base: 'full', md: 'lg' }}
      {...props}
      open={modalIsOpen}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
    >
      <Dialog.Header
        hideCloseButton={isSafariBrowser && isMobile}
        onClose={handleClose}
        maxW={617}
        px={6}
        mb={0}
        mt={isMobile ? 10 : 0}
        pt={isSafariBrowser && isMobile ? 6 : isMobile ? 0 : 'unset'}
        title="Terms of Use"
        titleSxProps={{ fontSize: 'sm' }}
        description={
          'You must accept the Terms of Use before you finish creating your account.'
        }
        descriptionFontSize="xs"
      />

      <Dialog.Body flex={1} maxH="100vh" maxW={617} p={6}>
        <VStack
          h={textHeight}
          flex={1}
          aria-label="Terms of Use"
          gap={0}
          overflowY={'scroll'}
          pr={4}
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
              maxHeight: '330px',
              backgroundColor: 'grey.900',
              borderRadius: '30px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'brand.500',
              borderRadius: '30px',
              height: '10px',
            },
          }}
        >
          <VStack w="full" alignItems={'flex-start'}>
            {termsOfUse.map(({ title, paragraphs }, index) => (
              <Box key={title}>
                <Text
                  fontSize="sm"
                  color="textPrimary"
                  fontWeight="bold"
                  mb={4}
                  mt={!index ? 0 : 4}
                >
                  {title}
                </Text>
                <VStack alignItems="flex-start">
                  {paragraphs.map((paragraph) => (
                    <Text
                      key={paragraph}
                      fontSize="sm"
                      color="textPrimary"
                      fontWeight={400}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>

          <Separator my={10} w="full" />

          <Text fontSize="sm" fontWeight={'bold'}>
            Bako Safe Privacy Policy
          </Text>

          <VStack w="full" alignItems="flex-start">
            {privacyPolicy.map(({ title, paragraphs }, index) => (
              <Box
                key={title}
                ref={privacyPolicy.length - 1 === index ? inView.ref : null}
              >
                <Text
                  fontSize={'sm'}
                  color={'grey.75'}
                  fontWeight={'bold'}
                  my={4}
                >
                  {title}
                </Text>
                <VStack alignItems={'flex-start'}>
                  {paragraphs.map((paragraph) => (
                    <Text
                      key={paragraph}
                      fontSize={'sm'}
                      color={'grey.75'}
                      fontWeight={400}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions
        w="full"
        hideDivider
        maxW={617}
        css={{ '&>hr': { mt: 0, mb: 8 } }}
        position={isMobile ? 'absolute' : 'unset'}
        bottom={2}
        px={6}
        mb={2}
      >
        <VStack w="full" alignItems="center" zIndex={999}>
          <HStack w="full" justifyContent="space-between">
            <Dialog.SecondaryAction w="50%" onClick={handleClose}>
              Decline
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              w="50%"
              aria-label="Accept Terms of Use"
              onClick={props.actionHandler}
              disabled={!read}
              _hover={{ opacity: 0.8 }}
            >
              Accept
            </Dialog.PrimaryAction>
          </HStack>
        </VStack>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { TermsOfUseDialog };
