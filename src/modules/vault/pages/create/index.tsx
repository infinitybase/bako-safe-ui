import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
} from '@chakra-ui/react';

import { CreateVaultForm } from '../../components';
import { useCreateVault } from '../../hooks';

const CreateVaultPage = () => {
  const { form, addresses, tabs, navigate } = useCreateVault();

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
            onClick={() => navigate('/home')}
          >
            Cancel
          </Button>
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        <CreateVaultForm form={form} addresses={addresses} tabs={tabs} />
      </CardBody>
    </Card>
  );
};

export { CreateVaultPage };
