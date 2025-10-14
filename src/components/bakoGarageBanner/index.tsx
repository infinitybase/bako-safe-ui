import { Box, BoxProps, Image } from 'bako-ui';

import GarageBanner from '@/assets/garage-new-place-banner.png';

export const BakoGarageBanner = ({ ...rest }: BoxProps) => {
  return (
    <Box position="relative" {...rest}>
      <Image
        src={GarageBanner}
        alt="Bako Garage Banner"
        borderRadius="lg"
        width="full"
        height="101px"
      />
    </Box>
  );
};
