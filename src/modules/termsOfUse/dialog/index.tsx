import { Box, HStack, Separator, Text, VStack } from 'bako-ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Dialog } from '@/components';
import { ChevronDownIcon } from '@/components/icons/chevron-down';

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
    onOpenChange,
  } = useTermsDialog();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showBottomChevron, setShowBottomChevron] = useState(true);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 4;
    setShowBottomChevron(!atBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
    setShowBottomChevron(false);
  }, []);

  const scrollToTop = useCallback(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    setShowBottomChevron(true);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  return (
    <Dialog.Modal
      size={{ base: 'full', md: 'lg' }}
      {...props}
      open={modalIsOpen}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
      modalContentProps={{ px: 0, py: 0 }}
    >
      <Dialog.Header
        hideCloseButton={isSafariBrowser && isMobile}
        onClose={handleClose}
        px={6}
        pt={6}
        mb={0}
        mt={0}
        title="Terms of Use"
        titleSxProps={{ fontSize: 'sm' }}
        description={
          'You must accept the Terms of Use before you finish creating your account.'
        }
        descriptionFontSize="xs"
      />

      <Dialog.Body flex={1} p={6} display="flex" maxH="80vh">
        <Box position="relative" flex={1}>
          <VStack
            maxH="full"
            flex={1}
            aria-label="Terms of Use"
            gap={0}
            overflowY={'scroll'}
            ref={scrollRef}
            onScroll={handleScroll}
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
                        fontSize="xs"
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
                    fontSize="sm"
                    color="textPrimary"
                    fontWeight="bold"
                    my={4}
                  >
                    {title}
                  </Text>
                  <VStack alignItems={'flex-start'}>
                    {paragraphs.map((paragraph) => (
                      <Text
                        key={paragraph}
                        fontSize="xs"
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
          </VStack>
          {showBottomChevron && (
            <>
              <Box
                position="absolute"
                left={0}
                bottom={0}
                w="full"
                h="70px"
                pointerEvents="none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(21, 20, 19, 0.00) 0%, rgba(21, 20, 19, 0.75) 30%, #151413 100%)',
                }}
              />
              <Box
                position="absolute"
                bottom={4}
                left="50%"
                transform="translateX(-50%)"
                zIndex={10}
                onClick={scrollToBottom}
                cursor="pointer"
              >
                <ChevronDownIcon
                  fontSize={24}
                  color="textPrimary"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.55))' }}
                />
              </Box>
            </>
          )}
          {!showBottomChevron && (
            <>
              <Box
                position="absolute"
                left={0}
                top={0}
                w="full"
                h="70px"
                pointerEvents="none"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(21, 20, 19, 0.00) 0%, rgba(21, 20, 19, 0.75) 30%, #151413 100%)',
                }}
              />
              <Box
                position="absolute"
                top={4}
                left="50%"
                transform="translateX(-50%) rotate(180deg)"
                zIndex={10}
                onClick={scrollToTop}
                cursor="pointer"
              >
                <ChevronDownIcon
                  fontSize={24}
                  color="textPrimary"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.55))' }}
                />
              </Box>
            </>
          )}
        </Box>
      </Dialog.Body>
      <Dialog.Actions w="full" px={6} pb={6}>
        <VStack w="full" alignItems="center">
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
