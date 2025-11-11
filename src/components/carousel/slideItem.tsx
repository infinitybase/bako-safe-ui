import { Box, BoxProps } from 'bako-ui';

interface CarouselSlideItemProps extends BoxProps {
  children: React.ReactNode;
}

const CarouselSlideItem = ({ children, ...props }: CarouselSlideItemProps) => {
  return (
    <Box flex="0 0 100%" ml={2} {...props}>
      {children}
    </Box>
  );
};

export default CarouselSlideItem;
