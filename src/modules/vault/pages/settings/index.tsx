import { Box, Grid, GridItem, HStack, Stack } from 'bako-ui';

import { CommingSoonDialog } from '@/components';
import AddAssetsDialog from '@/components/addAssetsDialog';
import DepositDialog from '@/components/depositDialog';
import { CLISettingsCard } from '@/modules/cli/components';
import { CreateAPITokenDialog } from '@/modules/cli/components/APIToken/create';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

import {
  SettingsOverview,
  SettingsOverviewSkeleton,
  SettingsQrCode,
  SettingsSigners,
  SettingsSignersSkeleton,
} from '../../components/settings';
import { useVaultInfosContext } from '../../hooks';

const VaultSettingsPage = () => {
  const depositDialog = useDisclosure();
  const addAssetsDialog = useDisclosure();
  const {
    vault,
    assets,
    CLIInfos: {
      CLISettings,
      APIToken: { dialog, list, create, steps, tabs },
      commingSoonFeatures: { commingSoonDialog, selectedFeature },
    },
  } = useVaultInfosContext();

  const isLoading = vault?.isLoading || assets.isLoading;

  if (!vault) return null;

  return (
    <Box w="full" flex={1}>
      <DepositDialog
        isOpen={depositDialog.isOpen}
        onOpenChange={depositDialog.onOpenChange}
        vault={vault.data}
      />

      <AddAssetsDialog
        isOpen={addAssetsDialog.isOpen}
        onOpenChange={addAssetsDialog.onOpenChange}
        setIsDepositDialogOpen={depositDialog.setOpen}
      />

      <HStack
        w="100%"
        gap={10}
        alignItems="start"
        flexWrap={{
          '2xlDown': 'wrap',
        }}
      >
        <Stack
          gap={10}
          flex={{
            '2xlDown': 1,
          }}
        >
          <HStack
            gap={10}
            flexDirection={{
              base: 'column',
              sm: 'row',
            }}
          >
            {isLoading && <SettingsOverviewSkeleton />}

            {!isLoading && (
              <>
                {/* Settings Overview */}
                <SettingsOverview vault={vault} assets={assets} />

                {/* Settings QR Code */}
                <SettingsQrCode address={vault.data.predicateAddress} />
              </>
            )}
          </HStack>

          {/* CLI settings */}
          <Grid
            templateColumns={{
              md: 'repeat(4, 1fr)',
              sm: 'repeat(2, 1fr)',
              base: 'repeat(1, 1fr)',
            }}
            gap={3}
          >
            {CLISettings.map((setting) => (
              <GridItem key={setting.label}>
                <CLISettingsCard
                  onClick={setting.onClick}
                  icon={setting.icon}
                  label={setting.label}
                  aria-label={setting.label}
                  disabled={setting.disabled}
                />
              </GridItem>
            ))}
          </Grid>
          <CreateAPITokenDialog
            control={dialog}
            steps={steps}
            tabs={tabs}
            create={create}
            list={list}
          />

          {selectedFeature && (
            <CommingSoonDialog
              description={selectedFeature.dialogDescription}
              isOpen={commingSoonDialog.isOpen}
              onClose={commingSoonDialog.onClose}
              notifyHandler={selectedFeature.notifyHandler}
              title="Coming Soon"
            />
          )}
        </Stack>

        {/** Signers Section */}
        {vault.isLoading ? (
          <SettingsSignersSkeleton />
        ) : (
          <SettingsSigners vault={vault} />
        )}
      </HStack>
    </Box>
  );
};

export { VaultSettingsPage };
