import { Box, BoxProps } from '@chakra-ui/react';

interface CarouselSlideProps extends BoxProps {
  children: React.ReactNode;
}

const CarouselSlide = ({ children, ...props }: CarouselSlideProps) => {
  return (
    <Box display="flex" {...props}>
      {children}
    </Box>
  );
};

export default CarouselSlide;
