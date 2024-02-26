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
  Heading,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { ErrorIcon } from '@/components';

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
  const { setSearch, search } = useWebAuthn();
  const { createAccountMutate, signAccountMutate } = DrawerWebAuth();
  const [sign, setSign] = useState<SignWebAuthnPayload>({
    id: '',
    challenge: '',
    publicKey: '',
  });

  return (
    <Drawer {...drawerProps} size="sm" variant="glassmorphic" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={drawerProps.onClose} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <DrawerHeader mb={10}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
              Connect your Wallet
            </Heading>
          </VStack>
        </DrawerHeader>

        <Divider borderColor="dark.100" mb={8} />

        <DrawerBody>
          <Input
            placeholder="Search for hardware id"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          <Button
            onClick={async () => {
              const data = await createAccountMutate.mutateAsync(search);
              setSign({
                id: data.id,
                challenge: data.code,
                publicKey: data.publicKey,
              });
            }}
          >
            <Text variant="description">Create</Text>
          </Button>

          <Button
            onClick={async () => {
              const data = await signAccountMutate.mutateAsync(sign);
              console.log(data);
            }}
          >
            <Text variant="description">SIGN</Text>
          </Button>

          {/* <Select
            // value={props.value}
            // onChange={props.onChange}
            // isInvalid={props.isInvalid}
            placeholder=" "
          >
            {assets.map((asset) => (
              <option key={asset.assetId} value={asset.assetId}>
                {asset.slug} - {asset.name}
              </option>
            ))}
          </Select> */}
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
