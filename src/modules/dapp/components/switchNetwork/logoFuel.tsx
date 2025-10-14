import { Box, Icon } from 'bako-ui';

import { FuelIcon } from '@/components';

const FuelLogo = () => {
  return (
    <Box padding={1} bgColor="#00F58C" borderRadius={8}>
      <Icon as={FuelIcon} fontSize={40} />
    </Box>
  );
};

export { FuelLogo };
