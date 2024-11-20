export enum VaultRoles {
  OWNER = 'OWNER',
  SIGNER = 'SIGNER',
}

const vaultRoles = {
  [VaultRoles.OWNER]: {
    title: 'Owner',
    variant: 'success',
  },
  [VaultRoles.SIGNER]: {
    title: 'Signer',
    variant: 'warning',
  },
};

export { vaultRoles };
