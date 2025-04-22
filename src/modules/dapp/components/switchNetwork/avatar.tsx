import { Avatar as AvatarUI } from '@chakra-ui/react';

interface AvatarInfoProps {
  size: string;
  bgColor: string;
  src?: string;
  name: string;
}

const AvatarSwitchNetwork = ({ ...props }: AvatarInfoProps) => {
  return (
    <AvatarUI
      color="#AAA6A1"
      boxSize={props.size}
      bgColor={props.bgColor}
      src={props.src}
      name={props.name}
      sx={{
        '& div': { fontSize: '14px' },
      }}
      borderRadius={'4px'}
    />
  );
};

export { AvatarSwitchNetwork };
