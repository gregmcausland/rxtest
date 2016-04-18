
const contentClient = contentful.createClient({
    space: 'iiju728tt7xi',
    accessToken: '84530c9a1e806f434f983dd276d1c41553fc94970de19f2a628e308515114f55'
});

contentClient
    .getEntries({
        'sys.id': '24z84Byv1eg04kSSQU8q6U'
    })
    .then(playlists => {
        const [ playlist ] = playlists.items;
        playlist.fields.tracks
            .map(song => song.fields)
            .forEach(song => console.log(song));
    });