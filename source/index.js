
import Immutable from 'immutable';
import Rx from 'rxjs';

function reducer(state, action) {
  switch (action.type) {
    case 'inc':
     return state.updateIn(['clicks'], clicks => clicks+1);
    case 'dec':
      return state.updateIn(['clicks'], clicks => clicks-1);
  }
  return state;
}

function render(state) {
  const clicks = state.get('clicks');
  document.querySelector('#output')
    .innerHTML = `Total: ${clicks}`;
}

const subButton = document.querySelector('#sub');

const addClicks = Rx.Observable.fromEvent(document.querySelector('#add'), 'click')
  .map(evt => ({ type: 'inc' }));

const subClicks = Rx.Observable.fromEvent(document.querySelector('#sub'), 'click')
  .map(evt => ({ type: 'dec' }));

const stream = Rx.Observable.merge(addClicks, subClicks)
  .scan(reducer, Immutable.fromJS({ clicks: 0 }));

stream
  .subscribe(render);
