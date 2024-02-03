export const HomeQueryKey = {
  DEFAULT: 'home',
  WORKSPACE: 'workspace',
  FULL_DATA: () => [HomeQueryKey.DEFAULT, HomeQueryKey.WORKSPACE, 'full-data'],
};
