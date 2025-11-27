import {
  Avatar,
  Card,
  CardRootProps,
  Heading,
  HStack,
  Icon,
  Text,
  useClipboard,
  VStack,
} from 'bako-ui';
import { RiFileCopyFill } from 'react-icons/ri';

import { EditIcon, IconTooltipButton, RemoveIcon } from '@/components';
import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

interface ContactCardProps extends CardRootProps {
  nickname: string;
  address: string;
  avatar: string;
  showActionButtons: boolean;
  handleDelete: () => void;
  handleEdit: () => void;
}

const ContactCard = ({
  nickname,
  address,
  avatar,
  showActionButtons,
  handleDelete,
  handleEdit,
  ...rest
}: ContactCardProps) => {
  const {
    screenSizes: { isExtraSmall, isLitteSmall },
  } = useWorkspaceContext();

  const { copy, copied } = useClipboard({ value: address });

  return (
    <Card.Root
      display="flex"
      w="100%"
      bg="gray.700"
      cursor="pointer"
      rounded="2xl"
      {...rest}
    >
      <Card.Body flexDirection="row" alignItems="center" gap={3}>
        <Avatar
          shape="rounded"
          boxSize="4.5rem"
          key={address}
          src={avatar}
          name={nickname || address}
        />

        <VStack gap={4} flex={1}>
          <Card.Header
            p={0}
            w="full"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading
              as="h3"
              color="gray.100"
              fontSize="xs"
              fontWeight="bold"
              maxW={{
                base: isExtraSmall ? '55px' : isLitteSmall ? '80px' : '150px',
                sm: '95px',
                md: '210px',
                lg: '155px',
                xl: '200px',
              }}
              lineHeight="normal"
              truncate
            >
              {nickname +
                'asiasfuoashdfuhau fhuadfhaiusdfu asdufhuasdufuasdfu uasdfuhihuasdfh hfhfffffffff'}
            </Heading>

            <HStack>
              <IconTooltipButton
                onClick={copy}
                tooltipContent={copied ? 'Copied' : 'Copy Address'}
                placement="top"
              >
                <Icon
                  as={copied ? RiFileCopyFill : CopyTopMenuIcon}
                  color="gray.200"
                  w="12px"
                />
              </IconTooltipButton>

              {showActionButtons && (
                <>
                  <IconTooltipButton
                    aria-label="Edit"
                    tooltipContent="Edit"
                    onClick={handleEdit}
                    placement="top"
                  >
                    <Icon as={EditIcon} color="gray.200" w="12px" />
                  </IconTooltipButton>

                  <IconTooltipButton
                    aria-label="Delete"
                    tooltipContent="Delete"
                    onClick={handleDelete}
                    placement="top"
                  >
                    <Icon as={RemoveIcon} color="gray.200" w="12px" />
                  </IconTooltipButton>
                </>
              )}
            </HStack>
          </Card.Header>

          <Card.Footer p={0} w="full">
            <Text fontSize="xs" color="gray.300" wordBreak="break-word">
              {address}
            </Text>
          </Card.Footer>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export { ContactCard };
