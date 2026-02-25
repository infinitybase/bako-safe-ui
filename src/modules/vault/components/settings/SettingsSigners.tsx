import { Card, Heading, Text } from 'bako-ui';

import { SignersDetailsProps } from '@/modules/core/models/predicate';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { CardMember } from '../CardMember';

const SettingsSigners = ({ vault }: SignersDetailsProps) => {
  const {
    addressBookInfos: {
      requests: { listContactsRequest },
    },
  } = useWorkspaceContext();

  if (!vault) return null;
  const members = vault?.data?.members;

  return (
    <Card.Root variant="subtle" bg="bg.panel" rounded="2xl" width="full">
      <Card.Header
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading
          fontSize="sm"
          fontWeight="semibold"
          color="textPrimary"
          lineHeight="shorter"
        >
          Signers
        </Heading>
        <Text fontSize="xs" color="gray.400" lineHeight="shorter">
          Required{' '}
          {`${vault.data?.configurable?.SIGNATURES_COUNT ?? 0}/ ${vault.data?.members?.length ?? 0}`}
        </Text>
      </Card.Header>
      <Card.Body>
        {members?.map((member) => (
          <CardMember
            key={member.id}
            isOwner={vault?.data?.owner?.id === member.id}
            contacts={listContactsRequest.data ?? []}
            member={member}
          />
        ))}
      </Card.Body>
    </Card.Root>
  );
};

export { SettingsSigners };
