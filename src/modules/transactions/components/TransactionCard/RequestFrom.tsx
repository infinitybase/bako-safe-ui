import {
  Card,
  CardRootProps,
  HStack,
  Icon,
  IconProps,
  Separator,
  Text,
  VStack,
} from 'bako-ui';

import { Nullable } from '@/modules/core';

interface TransactionRequestFromProps extends CardRootProps {
  name: Nullable<string>;
  origin: Nullable<string>;
  icon?:
    | IconProps
    | React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >;
}

const TransactionRequestFrom = (props: TransactionRequestFromProps) => {
  const { name, origin, icon, ...rest } = props;

  return (
    <Card.Root
      {...rest}
      bgColor="grey.825"
      borderColor="grey.925"
      borderRadius={8}
      p={2}
      borderWidth="1px"
      w="full"
    >
      <Text fontSize={10} color="grey.425" fontWeight={400}>
        Requesting a transaction from:
      </Text>

      <Separator borderColor="grey.950" my={1} />

      <HStack width="100%" gap={3.5}>
        {icon && <Icon as={icon} fontSize={28} />}
        <VStack alignItems="flex-start" gap={0.5}>
          <Text color="grey.250" fontSize={12} fontWeight={500}>
            {name}
          </Text>
          <Text color="brand.500" fontSize={12} fontWeight={400} lineHeight={4}>
            {origin?.split('//')[1]}
          </Text>
        </VStack>
      </HStack>
    </Card.Root>
  );
};

export { TransactionRequestFrom };
