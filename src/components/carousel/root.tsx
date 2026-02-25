import { Box, BoxProps } from 'bako-ui';
import { EmblaViewportRefType } from 'embla-carousel-react';

interface CarouselRootProps extends BoxProps {
  children: React.ReactNode;
  emblaRef: EmblaViewportRefType;
}

const CarouselRoot = ({ children, emblaRef, ...rest }: CarouselRootProps) => {
  return (
    <Box ref={emblaRef} overflow="hidden" width="100%" flexShrink={0} {...rest}>
      {children}
    </Box>
  );
};

export default CarouselRoot;
