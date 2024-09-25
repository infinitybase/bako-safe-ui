import {
  Box,
  Divider,
  HStack,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';

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

  const [isLargerThan600] = useMediaQuery('(min-height: 600px)');
  const [isLargerThan660] = useMediaQuery('(min-height: 660px)');
  const [isLargerThan768] = useMediaQuery('(min-height: 768px)');
  const [isLargerThan900] = useMediaQuery('(min-height: 900px)');

  const textHeight = () => {
    if (isMobile) {
      if (isLargerThan900) return 600;
      if (isLargerThan768) return 460;
      if (isLargerThan660) return 340;
      if (isLargerThan600) return 300;
      return 200;
    }
    return 420;
  };

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
        mt={isMobile ? 10 : 0}
        pt={isSafariBrowser && isMobile ? 6 : isMobile ? 0 : 'unset'}
        title="Terms of Use"
        description={
          'You must accept the Terms of Use before you finish creating your account.'
        }
        descriptionFontSize="sm"
      />

      <Divider maxW={585} borderColor={'grey.500'} mt={6} mb={6} />

      <Dialog.Body maxW={585} pb={6}>
        <VStack
          h={textHeight()}
          spacing={0}
          overflowY={'scroll'}
          pr={4}
          sx={{
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
                  fontSize={'sm'}
                  color={'grey.75'}
                  fontWeight={'bold'}
                  mb={4}
                  mt={!index ? 0 : 4}
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

          <Divider my={10} borderColor={'grey.500'} />

          <Text fontSize={'lg'} fontWeight={'bold'}>
            Bako Safe Privacy Policy
          </Text>

          <VStack w="full" alignItems={'flex-start'}>
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
        sx={{ '&>hr': { mt: 0, mb: 8 } }}
        bgColor="dark.950"
        position={isMobile ? 'absolute' : 'unset'}
        bottom={2}
        px={isMobile ? 6 : 'unset'}
        mb={2}
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
