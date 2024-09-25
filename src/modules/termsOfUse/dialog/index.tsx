import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/react';

import { Dialog } from '@/components';

import { useTermsDialog } from '../hooks/useTermsDialog';
import { privacyPolicy, termsOfUse } from '../utils/data';

type TermsOfUseDialogProps = {
  actionHandler: () => void;
};

const TermsOfUseDialog = (props: TermsOfUseDialogProps) => {
  const {
    isSafariBrowser,
    isMobile,
    read,
    inView,
    handleClose,
    modalIsOpen,
    onClose,
  } = useTermsDialog();

  return (
    <Dialog.Modal
      size={{ base: 'full', md: '2xl' }}
      {...props}
      isOpen={modalIsOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        hideCloseButton={isSafariBrowser && isMobile}
        onClose={handleClose}
        maxW={585}
        mb={0}
        pt={isSafariBrowser && isMobile ? 6 : 'unset'}
        title="Terms of Use"
        description={
          'You must accept the Terms of Use before you finish creating your account.'
        }
        descriptionFontSize="sm"
      />

      <Divider maxW={585} borderColor={'grey.500'} mt={6} mb={6} />

      <Dialog.Body maxW={585}>
        <VStack
          maxH={420}
          spacing={0}
          overflowY={'scroll'}
          css={{
            '&::-webkit-scrollbar': { width: '0' },
            scrollbarWidth: 'none',
          }}
        >
          <VStack w="full" alignItems={'flex-start'} maxW={'1032px'}>
            {termsOfUse.map(({ title, paragraphs }) => (
              <Box key={title}>
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

          <Divider my={10} maxW={'1032px'} />

          <Text fontSize={'lg'} fontWeight={'bold'}>
            Bako Safe Privacy Policy
          </Text>

          <VStack w="full" alignItems={'flex-start'} maxW={'1032px'} mb={16}>
            {privacyPolicy.map(({ title, paragraphs }) => (
              <Box key={title}>
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

          <Box ref={inView.ref} color="transparent" />
        </VStack>
      </Dialog.Body>

      <Dialog.Actions
        w="full"
        maxW={585}
        mt={'auto'}
        sx={{ '&>hr': { mt: 0, mb: 8 } }}
        bgColor="dark.950"
        position={'unset'}
        bottom={0}
        px={'unset'}
      >
        <VStack w="full" alignItems="center" bg="dark.950" zIndex={999}>
          <HStack w="full" justifyContent="space-between">
            <Dialog.SecondaryAction
              bgColor="transparent"
              border="1px solid white"
              w={'50%'}
              onClick={handleClose}
              _hover={{ borderColor: 'brand.500', color: 'brand.500' }}
            >
              Decline
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              w="50%"
              onClick={props.actionHandler}
              isDisabled={!read}
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
