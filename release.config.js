// eslint-disable-next-line no-undef
module.exports = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/infinitybase/bako-safe-ui',
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
      },
    ],
    '@semantic-release/changelog',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
