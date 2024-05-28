import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';

import { SquarePlusIcon, StepProgress } from '@/components';
import { TransactionsBoxIcon } from '@/components/icons/transactions-box-icon';
import { useScreenSize } from '@/modules/core';

interface OnboardingStepProps {
  tabs: {
    tab: number;
    is: (value: number) => boolean;
    set: React.Dispatch<React.SetStateAction<number>>;
    length: number;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const OnboardingStep = (props: OnboardingStepProps) => {
  const { isExtraSmallDevice } = useScreenSize();

  return (
    <Center
      flexDirection="column"
      p={{
        base: 1,
        sm: 6,
      }}
      h={{ base: isExtraSmallDevice ? 560 : 710 }}
    >
      <Box m={{ base: 4, sm: 8 }}>
        <Icon fontSize={{ base: 86, sm: 100 }} as={TransactionsBoxIcon} />
      </Box>
      <Box mb={{ base: 2, sm: 5 }}>
        <Heading fontSize={{ base: 'xl', xs: '3xl' }}>Heads up!</Heading>
      </Box>
      <Box maxW={350} mb={{ base: 2, sm: 5 }}>
        <Text
          color="grey.400"
          fontSize={{ base: 'xs', xs: 'sm', sm: 'md' }}
          textAlign="center"
        >
          Before you create your workspace, {`it's`} crucial to understand how
          they function!
        </Text>
      </Box>
      <Box w="100%" my={{ base: 3, sm: 5 }}>
        <StepProgress value={props.tabs.tab} length={props.tabs.length} />
      </Box>

      <Box mb={{ base: 2, sm: 5 }} maxW={{ base: 'full', sm: 480 }}>
        <Text
          color="white"
          fontSize={{ base: 'xs', sm: 'md' }}
          textAlign="start"
        >
          Workspaces are shared spaces that allow multiple people to access the
          same vaults and address book. Within a workspace, you can assign
          members different levels of permission, including:
        </Text>
      </Box>
      <VStack
        mb={{ base: isExtraSmallDevice ? 0 : 3, sm: 5 }}
        overflowY="scroll"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
            width: '5px',
            maxHeight: '330px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2C2C2C',
            borderRadius: '30px',
            height: '10px' /* Adjust the height of the scrollbar thumb */,
          },
        }}
      >
        <HStack>
          <Box w="100%" maxW={{ base: '80px', sm: '90px' }} mr={3}>
            <Badge
              justifyContent="center"
              py={{
                base: 0.3,
              }}
              px={7}
              variant="success"
            >
              Admin
            </Badge>
          </Box>
          <Text color="grey.200" fontSize={{ base: 'xs', xs: 'sm', sm: 'md' }}>
            Manage members, create new vaults, create transaction and access
            everything.
          </Text>
        </HStack>
        <HStack>
          <Box w="100%" maxW={{ base: '80px', sm: '90px' }} mr={3}>
            <Badge
              justifyContent="center"
              py={{
                base: 0.3,
              }}
              px={7}
              variant="yellow"
            >
              Manager
            </Badge>
          </Box>

          <Text color="grey.200" fontSize={{ base: 'xs', xs: 'sm', sm: 'md' }}>
            Can create new vaults, create transaction and access all vaults in
            the workspace.
          </Text>
        </HStack>
        <HStack>
          <Box w="100%" maxW={{ base: '80px', sm: '90px' }} mr={3}>
            <Badge
              justifyContent="center"
              py={{
                base: 0.3,
              }}
              px={7}
              variant="blue"
            >
              Viewer
            </Badge>
          </Box>
          <Text color="grey.200" fontSize={{ base: 'xs', xs: 'sm', sm: 'md' }}>
            Can only access and view the contents of all vaults in the
            workspace.
          </Text>
        </HStack>
      </VStack>

      <Box mb={{ base: 0, xs: 3, sm: 5 }} minW="full" maxW={500}>
        <Alert
          color="#F05D48"
          bgColor="rgba(240,93,72,0.1)"
          borderWidth={1}
          borderRadius={8}
          borderColor="rgba(7, 7, 7, 0.2)"
          px={{ base: 1, xs: 4 }}
        >
          <Text fontSize={{ base: 'xs', xs: 'sm', sm: 'md' }} maxW={440}>
            <b>Important Note</b>: Membership in the workspace ≠ signatory
            rights in a vault. They are separate entities with separate
            controls.
          </Text>
        </Alert>
      </Box>
      <Divider
        h="auto"
        mb={{ base: 3, xs: 4 }}
        borderColor="dark.100"
        mt={isExtraSmallDevice ? 3 : 'auto'}
      />
      <HStack w="full" spacing={4}>
        <Button
          _hover={{
            borderColor: 'brand.500',
            color: 'brand.500',
          }}
          w="25%"
          border="1px solid white"
          bgColor="transparent"
          variant="secondary"
          onClick={props.onCancel}
        >
          Cancel
        </Button>
        <Button
          w="75%"
          color="grey.300"
          variant="primary"
          onClick={props.onConfirm}
          leftIcon={<SquarePlusIcon fontSize={18} />}
          _hover={{
            opacity: 0.8,
          }}
        >
          Create workspace
        </Button>
      </HStack>
    </Center>
  );
};

export { OnboardingStep };
