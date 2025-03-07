import { CloseIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import React from 'react';

const BAKO_SUPPORT_SEARCH = 'BAKO_SUPPORT_SEARCH';
const BAKO_SUPPORT_SEARCH_URL = 'https://forms.gle/xqh4sADPoULPupnG8';
const BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE =
  'BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE';

const FloatingCard = () => {
  const handleClose = () => {
    localStorage.setItem(BAKO_SUPPORT_SEARCH, 'false');
    setIsVisible(false);
  };

  const hasOpened = () => {
    const hasSupportSearch =
      localStorage.getItem(BAKO_SUPPORT_SEARCH) === 'true';
    const hasResponded =
      localStorage.getItem(BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE) === 'true';

    return hasSupportSearch && !hasResponded;
  };

  const handleClick = () => {
    localStorage.setItem(BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE, 'true');
    window.open(BAKO_SUPPORT_SEARCH_URL, '_blank');
    handleClose();
  };

  const [isVisible, setIsVisible] = React.useState(hasOpened);

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      bottom="16px"
      right={{ base: 'auto', md: '16px' }}
      left={{ base: '50%', md: 'auto' }}
      transform={{ base: 'translateX(-50%)', md: 'none' }}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      p={4}
      maxW="400px"
      width={{ base: '90%', md: '320px' }}
      zIndex="9999"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        cursor={'pointer'}
      >
        <HStack spacing={3}>
          <StarIcon color="#FFC010" boxSize={6} />
          <Box onClick={handleClick}>
            <Text fontSize="14" color="#151413" lineHeight="1.2">
              Support the Bako team!
            </Text>
            <Text fontSize="12" color="#5E5955" mt={1} lineHeight="1.4">
              Answer our survey and unlock a special reward!
            </Text>
          </Box>
        </HStack>
        <IconButton
          aria-label="Close card"
          icon={<CloseIcon />}
          size="sm"
          onClick={handleClose}
          variant="ghost"
          _hover={{ bg: 'gray.200' }}
        />
      </Flex>
    </Box>
  );
};

export default FloatingCard;
