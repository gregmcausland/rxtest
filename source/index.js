
import h              from 'virtual-dom/h';
import diff           from 'virtual-dom/diff';
import patch          from 'virtual-dom/patch';
import createElement  from 'virtual-dom/create-element';

function getPlayerContent(contentClient) {
  return contentClient
    .getEntries({
      'sys.id': '24z84Byv1eg04kSSQU8q6U'
    })
    .then(playlists => playlists.items[0].fields.tracks);
}

function renderPlayList({ tracks, playing }) {
  const tracksDom = tracks
      .map(track => h('li', {
        className : (playing === track.sys.id) ? 'is-playing' : '',
        attributes : {
          'data-track-id': track.sys.id,
          'data-track-url': track.fields.file.url
        }
      }, track.fields.title ));

  return h('ul.playlist', tracksDom);
}

function getNewState(state, action) {
  console.log(action)
  switch (action.type) {
    case 'PLAY':
      state.playing = action.id;
      return state;

    case 'PLAYBACK_ENDED', 'PLAYBACK_PAUSED' :
      state.playing = undefined;
      return state;
  }
  return state;
}

function sideEffects(action) {
  const player = document.querySelector('#player');
  switch (action.type) {
    case 'PLAY':
      player.src = action.url;
      player.play();
      break;
  }
}

function getNewStateAndSideEffects(state, action) {
  sideEffects(action);
  return getNewState(state, action);
}

function buildActionStreams({ playlist, player }) {
  const playlistClicks = Rx.Observable.fromEvent(playlist, 'click');

  const playerEnded = Rx.Observable.fromEvent(player, 'ended')
    .map(evt => ({ type: 'PLAYBACK_ENDED' }));

  const playerPaused = Rx.Observable.fromEvent(player, 'pause')
    .map(evt => ({ type: 'PLAYBACK_PAUSED' }));

  const playActions = playlistClicks
    .filter(evt => evt.target.hasAttribute('data-track-url'))
    .map(evt => ({
      type: 'PLAY',
      url: evt.target.getAttribute('data-track-url'),
      id: evt.target.getAttribute('data-track-id')
    }));

  return Rx.Observable.merge(playActions, playerEnded, playerPaused);
}

function startPlayer(tracks) {
  const playlist = document.querySelector('#playlist');
  const player = document.querySelector('#player');

  const initialState = {
    tracks,
    playing: undefined
  }

  let DOM = createElement(renderPlayList(initialState));

  document
    .querySelector('#playlist')
    .appendChild(DOM);

  buildActionStreams({ playlist, player })
    .scan(getNewStateAndSideEffects, initialState)
    .subscribe(state => {
      const newDOMTree = renderPlayList(state);
      const patches = diff(DOM, newDOMTree);
      DOM = patch(DOM, patches);
    });
}

const contentClient = contentful.createClient({
  space: 'iiju728tt7xi',
  accessToken: '84530c9a1e806f434f983dd276d1c41553fc94970de19f2a628e308515114f55'
});

getPlayerContent(contentClient)
  .then(startPlayer);
