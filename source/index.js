import diff           from 'virtual-dom/diff';
import patch          from 'virtual-dom/patch';
import createElement  from 'virtual-dom/create-element';

import { buildActionStreams } from './eventstreams';
import { renderPlayList, sideEffects } from './dom';
import { getPlayerContent }   from './data';
import { getNewState } from './state';

function getNewStateAndSideEffects(state, action) {
  const newState = getNewState(state, action);
  sideEffects(action, state);
  return newState;
}

function startPlayer(tracks) {
  const playlist = document.querySelector('#playlist');
  const player = document.querySelector('#player');

  const initialState = {
    tracks,
    playing: undefined,
    lastPlayed: undefined,
    playState: undefined
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
