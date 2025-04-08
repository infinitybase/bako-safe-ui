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
    [
      '@semantic-release/github',
      {
        releaseBodyTemplate: `<% if (nextRelease.notes.length < 100000) { %>
<%= nextRelease.notes %>
<% } else { %>
<%= nextRelease.notes.slice(0, 100000) %>...
<% } %>`,
      },
    ],
    [
      '@semantic-release/git',
      {
        message: `chore(release): <%= nextRelease.version %> [skip ci]`,
      },
    ],
  ],
};
