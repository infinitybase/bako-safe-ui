import {
  Button,
  Drawer,
  DrawerRootProps,
  Field,
  Heading,
  HStack,
  Input,
  Portal,
  Radio,
  RadioGroup,
  Separator,
  Text,
  VStack,
} from 'bako-ui';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { useWebAuthnInput } from '@/modules/auth/hooks/webAuthn';
import { AddressUtils } from '@/modules/core/utils/address';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import {
  ActionKeys,
  handleActionUsingKeys,
} from '@/utils/handle-action-using-keys';

import { useSettings } from '../../hooks';

interface SettingsDrawerProps extends Omit<DrawerRootProps, 'children'> {
  onOpen: () => void;
}

const SettingsDrawer = ({ ...props }: SettingsDrawerProps) => {
  const {
    form,
    handleSubmitSettings,
    updateSettingsRequest: { isPending: isLoading },
    onCloseDrawer,
    mySettingsRequest,
  } = useSettings({
    onOpen: props.onOpen,
    onClose: () => props.onOpenChange?.({ open: false }),
  });
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();
  const { checkNicknameRequest, inputValue, setInputValue, handleInputChange } =
    useWebAuthnInput(!form.formState.errors.name, userInfos.id);

  const isNameInputInvalid = (form.watch('name')?.length ?? 0) <= 2;

  const isNicknameInUse =
    !!checkNicknameRequest.data?.type && inputValue?.length > 0;

  const name = mySettingsRequest.data?.name ?? '';

  const disableUpdateButton =
    isLoading ||
    isNicknameInUse ||
    checkNicknameRequest.isLoading ||
    isNameInputInvalid ||
    !form.formState.isValid;

  useEffect(() => {
    const _search = AddressUtils.isValid(name) ? '' : name;
    setInputValue(_search);
  }, [name, props.open]);

  return (
    <Drawer.Root
      {...props}
      size="sm"
      placement="end"
      onOpenChange={onCloseDrawer}
      open={props.open}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxW={456} py={6}>
            <Drawer.Header px={6} pb={8} pt={0}>
              <VStack alignItems="flex-start" gap={4} w="full">
                <HStack
                  gap={2}
                  alignItems="center"
                  justifyContent="space-between"
                  w="full"
                >
                  <Heading fontSize="md" fontWeight="bold" color="textPrimary">
                    Settings
                  </Heading>

                  <Drawer.CloseTrigger position="static">
                    <LineCloseIcon
                      w="24px"
                      aria-label="Close window"
                      cursor="pointer"
                      onClick={onCloseDrawer}
                    />
                  </Drawer.CloseTrigger>
                </HStack>
                <Text fontSize="xs" maxWidth={320} color="textSecondary">
                  Personalize Your Preferences: Set Your Name, Email, and Email
                  Notification Preferences.
                </Text>
              </VStack>
            </Drawer.Header>

            <Drawer.Body
              css={{
                '::-webkit-scrollbar': { width: 0 },
                scrollbarWidth: 'none',
              }}
              flex={1}
              display="flex"
              px={6}
              py={0}
              mb={6}
            >
              <VStack alignItems="flex-start" flex={1}>
                <Separator borderColor="gray.400" w="full" />

                <VStack gap={3} w="full" mt={6} mb={0.5}>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field.Root
                        invalid={fieldState.invalid || !!isNicknameInUse}
                      >
                        <Input
                          maxLength={19}
                          placeholder="Username"
                          value={inputValue}
                          onChange={(e) => {
                            handleInputChange(e.target.value.toLowerCase());
                            field.onChange(e.target.value.toLowerCase());
                          }}
                          onKeyDown={(e) =>
                            handleActionUsingKeys({
                              pressedKey: e.key,
                              allowedKeys: [ActionKeys.Enter],
                              action: handleSubmitSettings,
                              enabled: !disableUpdateButton,
                            })
                          }
                        />
                        <Field.HelperText
                          color={
                            checkNicknameRequest.data?.type ||
                            form.formState.errors.name?.message ||
                            isNameInputInvalid
                              ? 'error.500'
                              : 'grey.500'
                          }
                        >
                          {isNicknameInUse
                            ? 'Username already exists'
                            : form.formState.errors.name?.message
                              ? form.formState.errors.name?.message
                              : inputValue.length >= 3
                                ? 'This username is available'
                                : isNameInputInvalid
                                  ? 'Username must be at least 3 characters'
                                  : ''}
                        </Field.HelperText>
                      </Field.Root>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field.Root invalid={fieldState.invalid}>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Email Address"
                        />
                        <Field.HelperText color="error.500">
                          {fieldState.error?.message}
                        </Field.HelperText>
                      </Field.Root>
                    )}
                  />
                </VStack>

                <Separator borderColor="gray.400" mb={6} mt={4} w="full" />

                <Text fontWeight="bold" color="textPrimary" fontSize="sm">
                  Notifications Preferences
                </Text>
                <Text
                  fontSize="xs"
                  maxWidth={320}
                  color="textSecondary"
                  paddingBottom={1.5}
                >
                  Get wallet and vault alerts by email for enhanced security.
                </Text>

                <Text fontWeight="bold" color="textPrimary" fontSize="sm">
                  Do you wanna receive email notifications?
                </Text>

                <Controller
                  control={form.control}
                  name="notify"
                  defaultValue="false"
                  render={({ field: { value, onChange, ...rest } }) => (
                    <RadioGroup
                      colorPalette="primary"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      {...rest}
                      size="sm"
                    >
                      <VStack alignItems="flex-start">
                        <Radio value="true">Yes</Radio>
                        <Radio value="false">No</Radio>
                      </VStack>
                    </RadioGroup>
                  )}
                />
              </VStack>
            </Drawer.Body>

            <Drawer.Footer
              w="full"
              display="flex"
              gap={2}
              justifyContent="center"
              mt="auto"
              px={6}
              py={0}
            >
              <Button variant="subtle" flex={1} onClick={onCloseDrawer}>
                Cancel
              </Button>
              <Button
                disabled={disableUpdateButton}
                onClick={handleSubmitSettings}
                loading={isLoading}
                flex={1}
              >
                Update
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export { SettingsDrawer };
