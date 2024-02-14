import { Skeleton, SkeletonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CustomSkeletonProps extends SkeletonProps {
  children?: ReactNode;
}

const CustomSkeleton = ({
  children,
  isLoaded,
  ...props
}: CustomSkeletonProps) => (
  <Skeleton
    w="100%"
    speed={1}
    startColor="brand.500"
    endColor="dark.500"
    isLoaded={isLoaded}
    borderRadius={10}
    {...props}
  >
    {children}
  </Skeleton>
);

export { CustomSkeleton };
