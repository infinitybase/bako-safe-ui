import { Box, Image } from '@chakra-ui/react';
import { useState } from 'react';

import { CustomSkeleton } from '@/components';
import { parseURI } from '@/modules/core/utils/formatter';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface NFTHandlerProps {
  boxSize?: number;
  image?: string;
  children?: React.ReactNode;
}

const NFTHandler = ({ boxSize = 8, image, children }: NFTHandlerProps) => {
  const { assetsMap } = useWorkspaceContext();
  const [loaded, setLoaded] = useState(false);

  const imageSrc = parseURI(image || assetsMap?.UNKNOWN?.icon || '');

  return (
    <Box
      {...(loaded && {
        border: '1px solid',
        borderWidth: '1.5px',
        borderColor: 'yellow.600',
      })}
      rounded={8}
      overflow="hidden"
      boxSize={boxSize}
      position="relative"
    >
      {!loaded && (
        <CustomSkeleton
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          boxSize="100%"
        />
      )}

      {children ? (
        children
      ) : (
        <Image
          src={imageSrc}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          boxSize="100%"
          objectFit="cover"
        />
      )}
    </Box>
  );
};

export { NFTHandler };
