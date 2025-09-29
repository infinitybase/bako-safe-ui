import {
  Box,
  ComponentWithAs,
  Icon,
  IconProps,
  Image,
  Skeleton,
} from '@chakra-ui/react';
import { memo, useMemo } from 'react';

import { BakoIcon, UnknownIcon } from '@/components/icons';
import { useAvatar } from '@/modules/core/hooks/bako-id';

interface InputValueImageProps {
  image?: ComponentWithAs<'svg', IconProps>;
  label: string;
  boxSize?: string | number;
}

const InputValueImage = memo(
  ({ image, label, boxSize = '24px' }: InputValueImageProps) => {
    const isHandle = useMemo(() => label.startsWith('@'), [label]);
    const { avatar, isLoading } = useAvatar(
      isHandle ? label.replace('@', '') : '',
    );

    return (
      <>
        {isHandle ? (
          <Skeleton isLoaded={!isLoading} boxSize={boxSize} borderRadius="full">
            {avatar && (
              <Image
                src={avatar}
                alt={label}
                boxSize={boxSize}
                objectFit="cover"
                borderRadius="full"
              />
            )}
            {!avatar && (
              <Box borderRadius="full" boxSize={boxSize} bg="section.700">
                <BakoIcon boxSize={boxSize} />
              </Box>
            )}
          </Skeleton>
        ) : (
          <Icon boxSize={boxSize} as={image || UnknownIcon} />
        )}
      </>
    );
  },
);

InputValueImage.displayName = 'InputValueImage';

export default InputValueImage;
