import { Skeleton, SkeletonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CustomSkeletonProps extends SkeletonProps {
  children?: ReactNode;
  customStartColor?: string;
  customEndColor?: string;
}

const CustomSkeleton = ({
  children,
  isLoaded,
  ...props
}: CustomSkeletonProps) => (
  <Skeleton
    w="100%"
    speed={1}
    startColor={props.customStartColor ?? 'dark.200'}
    endColor={props.customEndColor ?? 'dark.500'}
    isLoaded={isLoaded}
    borderRadius={10}
    {...props}
  >
    {children}
  </Skeleton>
);

export { CustomSkeleton };
