
export function getNewState(state, action) {
  console.log(action)
  switch (action.type) {
    case 'PLAY':
      if (action.id) {
        state.currentTrack = action.id;
      } else {
        state.currentTrack = state.lastPlayed
          ? state.lastPlayed
          : state.tracks[0].sys.id;
      }
      state.lastPlayed = state.currentTrack;
      state.playing = true;
      return state;

    case 'PAUSE':
      state.playing = false;

    case 'RESUME':
      state.playing = true;

    case 'PLAYBACK_ENDED' :
      state.currentTrack = '';
      state.playing = false;
      return state;
  }
  return state;
}