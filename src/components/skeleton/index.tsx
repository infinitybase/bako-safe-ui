import { Skeleton } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CustomSkeletonProps {
  children: ReactNode;
  isLoaded: boolean;
}

const CustomSkeleton = ({ children, isLoaded }: CustomSkeletonProps) => (
  <Skeleton
    speed={1}
    startColor="dark.200"
    endColor="dark.500"
    isLoaded={isLoaded}
    w="100%"
    borderRadius={10}
  >
    {children}
  </Skeleton>
);

export { CustomSkeleton };
