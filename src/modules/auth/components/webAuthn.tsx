import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Heading,
  HStack,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

import { UseWebAuthn, WebAuthnState } from '../hooks';
import { CreateWebAuthnForm } from './form/CreateWebauthnAccount';
import { LoginWebAuthnForm } from './form/LoginWebauthnAccount';

interface DrawerWebAuthnProps extends Pick<DrawerProps, 'isOpen' | 'onClose'> {
  webauthn: UseWebAuthn;
}

const DrawerWebAuthn = (props: DrawerWebAuthnProps) => {
  const { webauthn, ...drawerProps } = props;
  const {
    form,
    tabs,
    resetDialogForms,
    accountsRequest,
    search,
    setSearch,
    nicknamesData,
    handleInputChange,
    closeWebAuthnDrawer,
  } = webauthn;
  const { formState, memberForm, loginForm } = form;

  const TabsPanels = (
    <TabPanels>
      <TabPanel p={0}>
        <LoginWebAuthnForm request={accountsRequest} form={loginForm} />
      </TabPanel>
      <TabPanel p={0}>
        <CreateWebAuthnForm
          form={memberForm}
          nickname={{
            search,
            setSearch,
            nicknamesData,
            searchHandler: handleInputChange,
          }}
        />
      </TabPanel>
    </TabPanels>
  );

  return (
    <Drawer {...drawerProps} size="md" variant="glassmorphic" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex
          mb={12}
          w="full"
          justifyContent={
            tabs.is(WebAuthnState.LOGIN) ? 'flex-end' : 'space-between'
          }
        >
          {tabs.is(WebAuthnState.REGISTER) && (
            <HStack cursor="pointer" onClick={resetDialogForms} spacing={3}>
              <MdOutlineArrowBackIosNew width={5} height={5} />
              <Text fontWeight="semibold" color="white" fontSize="lg">
                Back
              </Text>
            </HStack>
          )}
          <HStack cursor="pointer" onClick={closeWebAuthnDrawer} spacing={2}>
            <CloseIcon w={2.5} h={2.5} color="grey.100" />
          </HStack>
        </Flex>

        <DrawerHeader mb={8}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize="xl" fontWeight="bold" color="white">
              {formState.title}
            </Heading>
            <Text fontSize="sm" color="grey.500">
              {formState.description}
            </Text>
          </VStack>
        </DrawerHeader>

        <Box
          w="full"
          h="1px"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          mb={8}
        />

        <DrawerBody>
          <Tabs index={tabs.tab} isLazy>
            {TabsPanels}
          </Tabs>

          <VStack w="full" spacing={4}>
            <Button
              w="full"
              variant="primary"
              onClick={formState.handlePrimaryAction}
              _hover={{
                opacity: formState.isDisabled && 0.8,
              }}
              isDisabled={!!formState.isDisabled}
            >
              {formState.primaryAction}
            </Button>

            {tabs.is(WebAuthnState.LOGIN) && (
              <Button
                w="full"
                bgColor="transparent"
                border="1px solid white"
                variant="secondary"
                fontWeight="medium"
                onClick={formState.handleSecondaryAction}
                _hover={{
                  borderColor: 'brand.500',
                  color: 'brand.500',
                }}
              >
                {formState.secondaryAction}
              </Button>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { DrawerWebAuthn };
