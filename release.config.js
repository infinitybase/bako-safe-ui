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
        releaseBodyTemplate: `<% if (nextRelease.notes.length < 125000) { %>
<%= nextRelease.notes %>
<% } else { %>
<%= nextRelease.notes.slice(0, 124997).join('\n') %>...
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
