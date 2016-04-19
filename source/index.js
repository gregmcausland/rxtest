

function initPlayer() {
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
      document.querySelector('#playlist').innerHTML = renderPlayList({ tracks: playlist.fields.tracks });
    });
}

function renderPlayList({ tracks, playing }) {
  const trackMarkup = tracks
    .map(track => `<li data-track-id="${track.sys.id}" data-track-url="${track.fields.file.url}">${track.fields.title}</li>`)
    .reduce((acc, item) => acc + item);

  return `
    <ul class="playlist">
      ${trackMarkup}
    </ul>`;
}

const playlistClicks = Rx.Observable.fromEvent(document.querySelector('#playlist'), 'click');

const trackStream = playlistClicks
  .filter(evt => evt.target.hasAttribute('data-track-url'))
  .map(evt => evt.target.getAttribute('data-track-url'))
  .subscribe(track => {
    const player = document.querySelector('#player');
    player.src = track;
    player.play();
  });

initPlayer();