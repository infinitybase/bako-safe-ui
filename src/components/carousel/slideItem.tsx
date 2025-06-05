import { Box, BoxProps } from '@chakra-ui/react';

interface CarouselSlideItemProps extends BoxProps {
  children: React.ReactNode;
}

const CarouselSlideItem = ({ children, ...props }: CarouselSlideItemProps) => {
  return (
    <Box flex="0 0 100%" pl={2} {...props}>
      {children}
    </Box>
  );
};

export default CarouselSlideItem;
