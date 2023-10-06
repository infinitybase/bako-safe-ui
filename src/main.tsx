import {
  Box,
  Button,
  ChakraBaseProvider,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import { ErrorIcon, SquarePlusIcon } from '@/components';
import { BsafeQueryClientProvider } from '@/config';
import { defaultTheme } from '@/themes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BsafeQueryClientProvider>
      <ChakraBaseProvider theme={defaultTheme}>
        <App />

        <Modal
          variant="glassmorphic"
          onClose={console.log}
          size="2xl"
          isOpen
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <Flex mb={5} w="full" justifyContent="flex-end">
              <HStack cursor="pointer" spacing={2}>
                <ErrorIcon />
                <Text fontWeight="semibold" color="white">
                  Close
                </Text>
              </HStack>
            </Flex>
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              py={20}
            >
              <Box w="100%" maxW={420}>
                <VStack spacing={6}>
                  <FormControl>
                    <Input placeholder=" " />
                    <FormLabel>Vault name</FormLabel>
                  </FormControl>
                  <FormControl>
                    <Textarea placeholder=" " />
                    <FormLabel>Description</FormLabel>
                    <FormHelperText>Optional</FormHelperText>
                  </FormControl>
                </VStack>

                <Divider borderColor="dark.100" my={9} />

                <HStack spacing={4} justifyContent="center">
                  <Button variant="secondary" bgColor="dark.100" border="none">
                    Cancel
                  </Button>
                  <Button variant="primary" leftIcon={<SquarePlusIcon />}>
                    Continue
                  </Button>
                </HStack>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </ChakraBaseProvider>
    </BsafeQueryClientProvider>
  </React.StrictMode>,
);
