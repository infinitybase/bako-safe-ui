import { Box, Button, Center, Separator, Heading, Icon } from 'bako-ui';

import { VaultSuccessIcon } from '@/components';
import { ITemplatePayload } from '@/modules/core';
import { useModal, useSteps } from '@/modules/template/hooks';

const SuccesStep = () => {
  const { steps } = useSteps();
  const { step } = useModal();
  return (
    <Box>
      <Center flexDirection="column" mb={5}>
        <Box m={8}>
          <Icon fontSize={100} as={VaultSuccessIcon} />
        </Box>
        <Box mb={5}>
          <Heading color="brand.500">All set!!</Heading>
        </Box>
        <Box mb={5}>
          <Heading color="grey.200" fontSize="md" textAlign="center">
            The vault template is now ready for use whenever you need to
            stramline your workflow!
          </Heading>
        </Box>
        <Separator m={4} color="grey.300" />
        <Button
          m={4}
          variant="primary"
          color="grey.300"
          onClick={() => {
            steps[step].onSubmit({} as ITemplatePayload);
          }}
        >
          Conclude
        </Button>
      </Center>
    </Box>
  );
};

export { SuccesStep };
