import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Heading,
  HStack,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';

import { LineCloseIcon, ProgressButton } from '@/components';

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
    search,
    nicknamesData,
    signInProgress,
    setSearch,
    handleInputChange,
    closeWebAuthnDrawer,
  } = webauthn;
  const { formState, memberForm, loginForm } = form;

  const TabsPanels = (
    <TabPanels>
      <TabPanel p={0}>
        <LoginWebAuthnForm form={loginForm} />
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
    <Drawer
      {...drawerProps}
      size={{ base: 'full', xs: 'sm' }}
      variant="solid-dark"
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader mb={8}>
          <VStack alignItems="flex-start" spacing={5}>
            <HStack w="full" justifyContent="space-between">
              <Heading
                fontSize={{ base: 'md', xs: 'lg' }}
                fontWeight="bold"
                color="white"
              >
                {formState.title}
              </Heading>

              <LineCloseIcon
                fontSize="lg"
                color="grey.100"
                cursor="pointer"
                onClick={closeWebAuthnDrawer}
              />
            </HStack>

            <Text fontSize={{ base: 'xs', xs: 'sm' }} color="grey.500">
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
            {tabs.is(WebAuthnState.LOGIN) ? (
              <ProgressButton
                w="full"
                variant="primary"
                onClick={formState.handlePrimaryAction}
                _hover={{
                  opacity: formState.isDisabled && 0.8,
                }}
                isDisabled={!!formState.isDisabled}
                progress={signInProgress}
              >
                {formState.primaryAction}
              </ProgressButton>
            ) : (
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
            )}

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
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { DrawerWebAuthn };
