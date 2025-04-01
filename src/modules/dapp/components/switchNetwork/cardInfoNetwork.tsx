import { IconProps } from '@chakra-ui/icons';
import { ComponentWithAs, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';

import { AvatarSwitchNetwork } from './avatar';

//import { useNetworks } from '../../hooks';

interface CardInfoNetworkProps {
  header: string;
  logo?: string;
  title: string;
  operation: string;
  icon: ComponentWithAs<'svg', IconProps> | IconType;
  colorIcon: string;
  avatarUrl?: string;
  avataBgColor: string;
}

const CardInfoNetwork = ({ ...props }: CardInfoNetworkProps) => {
  return (
    <VStack
      w="full"
      height={90}
      bgColor={'#151413'}
      alignItems="flex-start"
      padding={3} //{12}
      gap={2} //{6}
      borderRadius={8}
    >
      <Text fontSize={12} fontWeight={400} color="#868079">
        {props.header}
      </Text>
      <HStack gap={2}>
        <AvatarSwitchNetwork
          size={'40px'}
          bgColor={props.avataBgColor}
          src={props.avatarUrl}
          name={props.title}
        />
        <VStack alignItems="flex-start">
          <Text
            fontSize={12}
            fontWeight={500}
            color="#F5F5F5"
            lineHeight={'100%'}
            letterSpacing={0}
          >
            {props.title}
          </Text>
          <HStack>
            <Text
              fontSize={12}
              fontWeight={400}
              color="#868079"
              lineHeight={'100%'}
              letterSpacing={0}
            >
              {props.operation}
            </Text>
            <Icon as={props.icon} color={props.colorIcon} fontSize="md" />
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export { CardInfoNetwork };
