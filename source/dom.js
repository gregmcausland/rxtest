
import h              from 'virtual-dom/h';

export function renderPlayList({ tracks, currentTrack, playing, paused }) {
  const tracksDom = tracks
      .map(track => h('li', {
        className : (currentTrack === track.sys.id) ? 'is-playing' : '',
        attributes : {
          'data-track-id': track.sys.id
        }
      }, track.fields.title ));

  return h('div', [
    h('ul.playlist', tracksDom),
    h('div.playerControls', [
      playing
        ? h('button.pause', { attributes: { 'data-event':'pause' } }, 'Pause')
        : h('button.play',  { attributes: { 'data-event':'play' } }, 'Play')
    ])
  ]);
}

export function sideEffects(action, state) {
  const player = document.querySelector('#player');
  const [ playing ] = state.tracks
    .filter(track => track.sys.id === state.currentTrack);

  switch (action.type) {
    case 'PLAY':
      if (player.src != playing.fields.file.url) player.src = playing.fields.file.url;
      player.play();
      break;

    case 'PAUSE':
      player.pause();
      break;
  }
}
