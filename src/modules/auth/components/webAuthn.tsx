import {
  Button,
  Divider,
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
import React from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

import { CloseIcon } from '@/components/icons/close-icon';

import { useWebAuthn, WebAuthnState } from '../hooks';
import { CreateWebAuthnForm } from './form/CreateWebauthnAccount';
import { LoginWebAuthnForm } from './form/LoginWebauthnAccount';

interface DrawerWebAuthnProps extends Pick<DrawerProps, 'isOpen' | 'onClose'> {}

const DrawerWebAuthn = (props: DrawerWebAuthnProps) => {
  const { ...drawerProps } = props;
  const { form, tabs, handleChangeTab, accountsRequest } = useWebAuthn();
  const { formState, memberForm, loginForm } = form;

  const disabledButton =
    !formState.isValid || form.loginForm.watch('name').length === 0;

  const TabsPanels = (
    <TabPanels>
      <TabPanel p={0}>
        <LoginWebAuthnForm request={accountsRequest} form={loginForm} />
      </TabPanel>
      <TabPanel p={0}>
        <CreateWebAuthnForm form={memberForm} />
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
            <HStack
              cursor="pointer"
              onClick={() => handleChangeTab(WebAuthnState.LOGIN)}
              spacing={3}
            >
              <MdOutlineArrowBackIosNew width={5} height={5} />
              <Text fontWeight="semibold" color="white" fontSize="lg">
                Back
              </Text>
            </HStack>
          )}
          <HStack cursor="pointer" onClick={drawerProps.onClose} spacing={2}>
            <Text fontWeight="semibold" color="white" fontSize="lg">
              Close
            </Text>
            <CloseIcon w={6} h={6} />
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

        <Divider mb={8} />

        <DrawerBody>
          <Tabs index={tabs.tab} isLazy>
            {TabsPanels}
          </Tabs>

          <HStack mt={12} w="full" justify="space-evenly">
            {tabs.is(WebAuthnState.LOGIN) && (
              <Button
                w="45%"
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

            <Button
              w={tabs.is(WebAuthnState.LOGIN) ? '45%' : '100%'}
              variant="primary"
              onClick={formState.handlePrimaryAction}
              _hover={{
                opacity: !disabledButton && 0.8,
              }}
              isDisabled={disabledButton}
            >
              {formState.primaryAction}
            </Button>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { DrawerWebAuthn };
