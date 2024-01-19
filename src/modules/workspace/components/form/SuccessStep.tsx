import { Box, Button, Center, Divider, Heading, Icon } from '@chakra-ui/react';

import { VaultSuccessIcon } from '@/components';

const SuccesStep = () => (
  <Center flexDirection="column" mb={5}>
    <Box m={8}>
      <Icon fontSize={100} as={VaultSuccessIcon} />
    </Box>
    <Box mb={5}>
      <Heading color="brand.600">All set!!</Heading>
    </Box>
    <Box mb={5}>
      <Heading color="grey.200" fontSize="md" textAlign="center">
        The vault template is now ready for use whenever you need to stramline
        your workflow!
      </Heading>
    </Box>
    <Divider m={4} color="grey.300" />
    <Button
      m={4}
      variant="primary"
      color="grey.300"
      onClick={() => console.log('Hello')}
    >
      Conclude
    </Button>
  </Center>
);

export { SuccesStep };
