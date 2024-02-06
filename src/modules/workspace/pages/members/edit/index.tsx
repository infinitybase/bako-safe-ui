import {
  Avatar,
  Badge,
  Box,
  Card,
  Center,
  Flex,
  HStack,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import {
  Dialog,
  FeedbackSuccess,
  SquarePlusIcon,
  StepProgress,
} from '@/components';
import { TrashIcon } from '@/components/icons/trash';
import {
  AddressUtils,
  EditMembersForm,
  MemberTabState,
  useGetWorkspaceRequest,
} from '@/modules';
import { useChangeMember } from '@/modules/workspace/hooks';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

const MemberTab = () => {
  const { workspaceId, memberId } = useParams();

  const request = useGetWorkspaceRequest(workspaceId ?? '');
  const workspace = request.workspace;
  const member = request.workspace?.members.find(
    (member) => member.id === memberId,
  );

  const permission = WorkspacePermissionUtils.getPermissionInWorkspace(
    workspace!,
    member!,
  );

  return (
    <Card
      w="full"
      bgColor="dark.300"
      p={4}
      mb={5}
      border="1px"
      borderColor="dark.100"
      key={member?.id}
    >
      <HStack w="full" justifyContent="space-between">
        <Center gap={4}>
          <Avatar
            size="md"
            fontSize="md"
            color="white"
            bg="grey.900"
            variant="roundedSquare"
            name={member?.name ?? member?.address}
          />
          <Flex
            mr={1}
            h="14"
            direction="column"
            alignItems="start"
            justifyContent="space-between"
          >
            <Text fontWeight="semibold" color="grey.200">
              {member?.name}
            </Text>
            <Text
              fontWeight={!member?.name ? 'semibold' : 'normal'}
              color={!member?.name ? 'grey.200' : 'grey.500'}
            >
              {AddressUtils.format(member?.address ?? '')}
            </Text>
            <Badge fontSize="xs" p={1} variant={permission?.variant}>
              {permission?.title}
            </Badge>
          </Flex>
        </Center>
      </HStack>
    </Card>
  );
};

export const EditMemberPage = () => {
  const { form, handleClose, tabs } = useChangeMember();
  const { formState, permissionForm } = form;

  const TabsPanels = (
    <TabPanels>
      <TabPanel></TabPanel>
      <TabPanel p={0}>
        <EditMembersForm form={permissionForm} />
      </TabPanel>
      <TabPanel p={0}>
        <FeedbackSuccess
          title={formState.title}
          description="To view all the members added to your workspace, click on settings on the workspace home page."
        />
      </TabPanel>
    </TabPanels>
  );

  return (
    <Dialog.Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
      <Dialog.Header
        maxW={420}
        title="Edit Member"
        description="Manage roles, remove or adjust permissions as needed."
      />

      <Dialog.Body
        mb={9}
        maxW={500}
        pr={12}
        maxH={600}
        overflowY="scroll"
        css={{
          '&::-webkit-scrollbar': {
            width: '5px',
            height: '5px' /* Adjust the height of the scrollbar */,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2C2C2C',
            borderRadius: '20px',
            height: '20px' /* Adjust the height of the scrollbar thumb */,
          },
        }}
      >
        <Tabs hidden={tabs.is(MemberTabState.SUCCESS)}>
          <MemberTab />
        </Tabs>
        <Box
          hidden={
            tabs.is(MemberTabState.PERMISSION) ||
            tabs.is(MemberTabState.SUCCESS)
          }
          mb={12}
        >
          <StepProgress length={tabs.length} value={tabs.tab} />
        </Box>
        <Tabs index={tabs.tab} isLazy colorScheme="green">
          {TabsPanels}
        </Tabs>

        <Dialog.Actions maxW={420}>
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
        <Dialog.Actions maxW={420}>
          {formState.tertiaryAction && (
            <Dialog.TertiaryAction
              display="block"
              onClick={formState.handleTertiaryAction}
              leftIcon={<TrashIcon />}
              isDisabled={!formState?.tertiaryAction}
              isLoading={formState?.isLoading}
            >
              {formState.tertiaryAction}
            </Dialog.TertiaryAction>
          )}
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
