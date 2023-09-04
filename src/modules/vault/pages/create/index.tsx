import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
} from '@chakra-ui/react';

import { Pages } from '@/modules';

import { CreateVaultForm } from '../../components';
import { useCreateVault } from '../../hooks';

const CreateVaultPage = () => {
  const { form, addresses, tabs, navigate, request } = useCreateVault();

  return (
    <Card bg="dark.500" width="100%" maxWidth={400} boxShadow="xl">
      <CardHeader>
        <Flex width="100%" justifyContent="space-between">
          <Heading color="white" size="lg">
            Predicates
          </Heading>

          <Button
            size="xs"
            color="brand.900"
            variant="solid"
            colorScheme="brand"
            loadingText="Connecting.."
            onClick={() => navigate(Pages.home())}
          >
            Cancel
          </Button>
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        <CreateVaultForm
          form={form}
          tabs={tabs}
          addresses={addresses}
          isLoading={request.isLoading}
        />
      </CardBody>
    </Card>
  );
};

export { CreateVaultPage };
