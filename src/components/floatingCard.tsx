import { Box, Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import { FiStar as StarIcon, FiX as CloseIcon } from 'react-icons/fi';

import { useQueryParams } from '@/modules';

export const BAKO_SUPPORT_SEARCH = 'BAKO_SUPPORT_SEARCH';
const BAKO_SUPPORT_SEARCH_URL = 'https://forms.gle/xqh4sADPoULPupnG8';
const BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE =
  'BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE';

const EXPIRE_DAYS = 5;

const FloatingCard = () => {
  const { sessionId: isFromDapp } = useQueryParams();

  const hasOpened = () => {
    if (isFromDapp) {
      return false;
    }

    const isEnabled = localStorage.getItem(BAKO_SUPPORT_SEARCH) === 'true';
    if (!isEnabled) {
      return false;
    }

    const hasResponded = localStorage.getItem(
      BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE,
    );
    if (!hasResponded) {
      return true;
    }

    if (hasResponded === 'permanent') {
      return false;
    }

    // Check if the temporary response has expired
    const expirationDate = new Date(hasResponded);
    return new Date() >= expirationDate;
  };

  const handleClose = () => {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + EXPIRE_DAYS);
    localStorage.setItem(
      BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE,
      expiration.toISOString(),
    );
    setIsVisible(false);
  };

  const handleClick = () => {
    localStorage.setItem(BAKO_SUPPORT_SEARCH_ALREADY_RESPONSE, 'permanent');
    window.open(BAKO_SUPPORT_SEARCH_URL, '_blank');
    setIsVisible(false);
  };

  const [isVisible, setIsVisible] = React.useState(() => hasOpened());

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsVisible(hasOpened());
    };

    window.addEventListener('bako-storage-change', handleStorageChange);

    return () => {
      window.removeEventListener('bako-storage-change', handleStorageChange);
    };
  }, []);

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
      <Flex alignItems="center" justifyContent="space-between" cursor="pointer">
        <HStack gap={3}>
          <StarIcon color="warning.550" />
          <Box onClick={handleClick}>
            <Text fontSize="14" color="dark.950" lineHeight="1.2">
              Support the Bako team!
            </Text>
            <Text fontSize="12" color="grey.550" mt={1} lineHeight="1.4">
              Answer our survey and unlock a special reward!
            </Text>
          </Box>
        </HStack>
        <IconButton
          aria-label="Close card"
          size="sm"
          onClick={handleClose}
          variant="ghost"
          _hover={{ bg: 'gray.200' }}
        >
          <CloseIcon />
        </IconButton>
      </Flex>
    </Box>
  );
};

export default FloatingCard;
