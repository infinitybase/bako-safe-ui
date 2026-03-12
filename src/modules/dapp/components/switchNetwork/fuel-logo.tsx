import { Box, Icon } from 'bako-ui';

import { FuelIcon } from '@/components/icons';

const DappNetworkFuelLogo = () => {
  return (
    <Box padding={1} bgColor="#00F58C" borderRadius={4}>
      <Icon as={FuelIcon} boxSize={7} />
    </Box>
  );
};

export { DappNetworkFuelLogo };
