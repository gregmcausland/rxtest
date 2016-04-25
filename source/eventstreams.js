export function buildActionStreams({ playlist, player }) {
  const playlistClicks = Rx.Observable.fromEvent(playlist, 'click');

  const playerEnded = Rx.Observable.fromEvent(player, 'ended')
    .map(evt => ({ type: 'PLAYBACK_ENDED' }));

  const playerPaused = Rx.Observable.fromEvent(player, 'pause')
    .map(evt => ({ type: 'PAUSE' }));

  const playerControls = playlistClicks
    .filter(evt => evt.target.hasAttribute('data-event'))
    .map(evt => ({ type: evt.target.getAttribute('data-event').toUpperCase() }));

  const playActions = playlistClicks
    .filter(evt => evt.target.hasAttribute('data-track-id'))
    .map(evt => ({
      type: 'PLAY',
      id: evt.target.getAttribute('data-track-id')
    }));

  return Rx.Observable.merge(playActions, playerEnded, playerPaused, playerControls);
}

// play
// pause
// volume