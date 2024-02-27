import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { CloseIcon } from '@/components/icons/close-icon';

import {
  redirectPathBuilder,
  useAuth,
  useQueryParams,
  useWebAuthn,
} from '../hooks';
import {
  SignWebAuthnPayload,
  TypeUser,
  UserQueryKey,
  UserService,
} from '../services';

interface DrawerWebAuthnProps extends Pick<DrawerProps, 'isOpen' | 'onClose'> {}

const createAccount = async (name: string) => {
  return await UserService.createWebAuthnAccount(name);
};

const signAccount = async (sign: SignWebAuthnPayload) => {
  console.log(sign);
  return await UserService.signMessageWebAuthn(sign);
};

const DrawerWebAuth = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { location, origin } = useQueryParams();

  const createAccountMutate = useMutation({
    mutationKey: UserQueryKey.CREATE_WEB_AUTHN_ACCOUNT(),
    mutationFn: createAccount,
  });

  const signAccountMutate = useMutation({
    mutationKey: UserQueryKey.SIGN_MESSAGE_WEB_AUTHN(),
    mutationFn: signAccount,
    onSuccess: ({ user_id, avatar, accessToken, workspace, address }) => {
      auth.handlers.authenticate({
        userId: user_id,
        avatar,
        account: address,
        accountType: TypeUser.WEB_AUTHN,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
      });
      navigate(redirectPathBuilder(!!origin, location, address));
    },
  });

  return { createAccountMutate, signAccountMutate };
};

const DrawerWebAuthn = (props: DrawerWebAuthnProps) => {
  const { ...drawerProps } = props;
  const { setSearch, search, useGetAccountsByHardwareId } = useWebAuthn();
  const { createAccountMutate, signAccountMutate } = DrawerWebAuth();
  const [sign, setSign] = useState<SignWebAuthnPayload>({
    id: '',
    challenge: '',
    publicKey: '',
  });

  const values = useGetAccountsByHardwareId(
    localStorage.getItem('hardwareId') || '',
  );

  console.log(values);
  return (
    <Drawer {...drawerProps} size="md" variant="glassmorphic" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={12} w="full" justifyContent="space-between">
          <HStack cursor="pointer" onClick={drawerProps.onClose} spacing={3}>
            <MdOutlineArrowBackIosNew width={5} height={5} />
            <Text fontWeight="semibold" color="white" fontSize="lg">
              Back
            </Text>
          </HStack>
          <HStack cursor="pointer" onClick={drawerProps.onClose} spacing={2}>
            <Text fontWeight="semibold" color="white" fontSize="lg">
              Close
            </Text>
            <CloseIcon w={6} h={6} />
          </HStack>
        </Flex>

        <DrawerHeader mb={10}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
              Login with WebAuthn
            </Heading>
          </VStack>
        </DrawerHeader>

        <Divider mb={8} />

        <DrawerBody>
          <FormControl mb={8}>
            <Input
              placeholder=" "
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <FormLabel>Username</FormLabel>
            <FormHelperText fontSize="sm" ml={2} color="grey.500">
              Select your username
            </FormHelperText>
          </FormControl>
          {/* <Select
            value={props.value}
            onChange={props.onChange}
            isInvalid={props.isInvalid}
            placeholder=" "
          >
            {assets.map((asset) => (
              <option key={asset.assetId} value={asset.assetId}>
                {asset.slug} - {asset.name}
              </option>
            ))}
          </Select> */}

          <HStack w="full" justify="space-evenly">
            <Button
              w="45%"
              bgColor="transparent"
              border="1px solid white"
              variant="secondary"
              fontWeight="medium"
              size="lg"
              onClick={async () => {
                const data = await createAccountMutate.mutateAsync(search);
                setSign({
                  id: data.id,
                  challenge: data.code,
                  publicKey: data.publicKey,
                });
              }}
            >
              Create account
            </Button>

            <Button
              w="45%"
              size="lg"
              variant="primary"
              onClick={async () => {
                console.log('antes da request');
                const data = await signAccountMutate.mutateAsync(sign);
                console.log(data);
              }}
            >
              Sign In
            </Button>
          </HStack>
        </DrawerBody>

        <DrawerFooter justifyContent="flex-start">
          <VStack alignItems="flex-start">
            <Heading fontSize="md" fontWeight="semibold" color="grey.200">
              New to Fuel network?
            </Heading>
            <Text variant="description">
              Fuel is the {`world's`} fastest modular execution layer.
            </Text>
            <Link
              fontSize="xs"
              color="brand.500"
              href="https://www.fuel.network/"
              target="_blank"
            >
              Learn more about Fuel
            </Link>
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export { DrawerWebAuthn };
