import {
  Badge,
  Box,
  Divider,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { Dialog } from '@/components';

import { UseChangeMember } from '../../hooks';
import { WorkspacePermissionUtils } from '../../utils';

interface EditMembersForm {
  form: UseChangeMember['form']['permissionForm'];
}

export const EditMembersForm = ({ form }: EditMembersForm) => {
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
                <React.Fragment key={permission.value}>
                  <Radio
                    my={2}
                    borderWidth={1}
                    borderColor="grey.500"
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
                </React.Fragment>
              ))}
            </Stack>
          </RadioGroup>
        )}
      />
    </Box>
  );
};
