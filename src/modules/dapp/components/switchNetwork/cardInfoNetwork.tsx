import { HStack, Icon, IconButton, Text, useClipboard, VStack } from 'bako-ui';
import { IconType } from 'react-icons';

type IconProps = {
  as?: IconType;
  boxSize?: number | string;
  color?: string;
};

import { CheckIcon } from '@/components';
import { AddressUtils } from '@/modules/core';
import { limitCharacters } from '@/utils';

import { AvatarSwitchNetwork } from './avatar';

interface CardInfoNetworkProps {
  header: string;
  title: string;
  operation: string;
  icon: IconType | JSX.Element;
  colorIcon: string;
  avataBgColor: string;
  avatarUrl?: string;
  opIsAddress?: boolean;
  logo?: string;
  onClick?: () => void;
}

const CardInfoNetwork = ({ ...props }: CardInfoNetworkProps) => {
  const clipboard = useClipboard(props.operation);

  const hasCopeid = props.opIsAddress && clipboard.hasCopied;

  return (
    <VStack
      w="full"
      height={81}
      bgColor={'dark.950'}
      alignItems="flex-start"
      padding={3}
      gap={1}
      borderRadius={8}
    >
      <Text fontSize={12} fontWeight={400} color="grey.425">
        {props.header}
      </Text>
      <HStack gap={3} h="40px">
        <AvatarSwitchNetwork
          size={'32px'}
          bgColor={props.avataBgColor}
          src={props.avatarUrl}
          name={props.title}
        />
        <VStack
          alignItems="flex-start"
          justifyContent="center"
          pt={1.5}
          gap={0}
          w="full"
        >
          <Text
            fontSize={12}
            fontWeight={500}
            color="grey.50"
            lineHeight={'100%'}
            letterSpacing={0}
          >
            {limitCharacters(props.title, 45)}
          </Text>
          <HStack w="full" gap={0.5}>
            <Text
              fontSize={12}
              fontWeight={400}
              color="grey.425"
              lineHeight={'100%'}
              letterSpacing={0}
            >
              {props.opIsAddress
                ? AddressUtils.format(props.operation ?? '', 4)
                : props.operation}
            </Text>
            <IconButton
              aria-label="Copy Adr"
              variant="icon"
              bgColor="none"
              size="xs"
              icon={
                <Icon
                  as={clipboard.hasCopied ? CheckIcon : props.icon}
                  color={hasCopeid ? 'success.700' : props.colorIcon}
                  fontSize={16}
                />
              }
              onClick={props.opIsAddress ? clipboard.onCopy : props.onClick}
            />
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export { CardInfoNetwork };
