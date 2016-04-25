export function getPlayerContent(contentClient) {
  return contentClient
    .getEntries({
      'sys.id': '24z84Byv1eg04kSSQU8q6U'
    })
    .then(playlists => playlists.items[0].fields.tracks);
}