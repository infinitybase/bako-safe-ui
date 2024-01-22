import {
  Badge,
  Box,
  Divider,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import {
  Dialog,
  FeedbackSuccess,
  SquarePlusIcon,
  StepProgress,
} from '@/components';
import { AutoComplete } from '@/components/autocomplete';
import {
  MemberTabState,
  UseChangeMember,
  useChangeMember,
} from '@/modules/workspace/hooks/members';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

interface MemberAddressForm {
  form: UseChangeMember['form']['memberForm'];
}

/* TODO: Move to components folder */
const MemberAddressForm = ({ form }: MemberAddressForm) => {
  return (
    <Box w="full">
      <Dialog.Section
        title={
          <Heading fontSize="md" color="grey.200">
            Member address
          </Heading>
        }
        description="Who it will be a new member in your workspace?"
        mb={8}
      />
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <AutoComplete
            label="Name or address"
            value={field.value}
            onInputChange={field.onChange}
            onChange={field.onChange}
            errorMessage={fieldState.error?.message}
            options={[]}
            isLoading={false}
            isInvalid={false}
            isDisabled={false}
          />
        )}
      />
    </Box>
  );
};

interface MemberPermissionForm {
  form: UseChangeMember['form']['permissionForm'];
}

/* TODO: Move to components folder */
const MemberPermissionForm = ({ form }: MemberPermissionForm) => {
  return (
    <Box w="full">
      <Dialog.Section
        title={
          <Heading fontSize="md" color="grey.200">
            Choose the user Permission
          </Heading>
        }
        description=""
        mb={8}
      />
      <Controller
        name="permission"
        control={form.control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onChange={field.onChange}
            defaultValue={field.value}
          >
            <Stack>
              {WorkspacePermissionUtils.permissionsValues.map((permission) => (
                <>
                  <Radio
                    my={2}
                    borderWidth={1}
                    borderColor="grey.500"
                    key={permission.value}
                    value={permission.value}
                  >
                    <HStack>
                      <Box w="full" maxW="80px">
                        <Badge variant={permission.variant}>
                          {permission.title}
                        </Badge>
                      </Box>
                      <Text variant="description">
                        {permission.description}
                      </Text>
                    </HStack>
                  </Radio>
                  <Divider borderColor="dark.100" />
                </>
              ))}
            </Stack>
          </RadioGroup>
        )}
      />
    </Box>
  );
};

const CreateMemberPage = () => {
  const { form, handleClose, tabs } = useChangeMember();
  const { formState, memberForm, permissionForm } = form;

  const TabsPanels = (
    <TabPanels>
      <TabPanel p={0}>
        <MemberAddressForm form={memberForm} />
      </TabPanel>
      <TabPanel p={0}>
        <MemberPermissionForm form={permissionForm} />
      </TabPanel>
      <TabPanel p={0}>
        <FeedbackSuccess
          title="New member added!"
          description="To view all the members added to your workspace, click on settings on the workspace home page."
        />
      </TabPanel>
    </TabPanels>
  );

  return (
    <Dialog.Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
      <Dialog.Header
        maxW={420}
        title="Add Member"
        description="Define the details of your vault. Set up this rules carefully because it cannot be changed later."
        hidden={tabs.is(MemberTabState.SUCCESS)}
      />

      <Dialog.Body mb={9} maxW={420}>
        <Box hidden={tabs.is(MemberTabState.SUCCESS)} mb={12}>
          <StepProgress length={tabs.length} value={tabs.tab} />
        </Box>
        <Tabs index={tabs.tab} colorScheme="green">
          {TabsPanels}
        </Tabs>
      </Dialog.Body>

      <Dialog.Actions
        maxW={420}
        hideDivider={tabs.is(MemberTabState.PERMISSION)}
      >
        <Dialog.SecondaryAction onClick={formState?.handleSecondaryAction}>
          {formState?.secondaryAction}
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          onClick={formState?.handlePrimaryAction}
          leftIcon={<SquarePlusIcon />}
          isDisabled={!formState?.isValid}
          isLoading={formState?.isLoading}
        >
          {formState.primaryAction}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateMemberPage };
