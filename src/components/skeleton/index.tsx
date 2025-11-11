import { Skeleton, SkeletonProps } from 'bako-ui';
import { ReactNode } from 'react';

interface CustomSkeletonProps extends SkeletonProps {
  children?: ReactNode;
  customStartColor?: string;
  customEndColor?: string;
}

const CustomSkeleton = ({
  children,
  // customEndColor,
  // customStartColor,
  ...props
}: CustomSkeletonProps) => (
  <Skeleton
    w="100%"
    // speed={1}
    // startColor={customStartColor ?? 'dark.200'}
    // endColor={customEndColor ?? 'dark.500'}
    borderRadius={10}
    {...props}
  >
    {children}
  </Skeleton>
);

export { CustomSkeleton };
