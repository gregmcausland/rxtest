
import Immutable from 'immutable';
import Rx from 'rxjs';

function getAppMarkup(state) {
  const todosMarkup = state.get('todos')
    .map((todo, index) => `
      <li class="${todo.get('complete') ? 'is-complete' : ''}">
        <span>${todo.get('task')} -</span>
        <button data-binding="completeTodo" data-index="${index}">${todo.get('complete') ? '&larr;' : '&check;'}</button>
        <button data-binding="deleteTodo" data-index="${index}">x</button>
      </li>`)
    .reduce((a, b) => a + b);

  return `
    <div class="">
      <input type="text" data-binding="todoInput">
      <button type="submit" data-binding="todoAdd">Add todo</button>
    </div>
    <ul class="">
      ${todosMarkup}
    </ul>`;
}

function getEventStream({ domNode, todoAction, deleteAction, completeAction }) {
  const clicks        = Rx.Observable.fromEvent(domNode, 'click');
  const keypress      = Rx.Observable.fromEvent(domNode, 'keypress');

  const addTodoClicks = clicks
    .filter(evt => evt.target.getAttribute('data-binding') === 'todoAdd')

  const addTodoKeypress = keypress
    .filter(evt => (evt.target.getAttribute('data-binding') === 'todoInput') && (evt.keyCode === 13));

  const completeTodoStream = clicks
    .filter(evt => evt.target.getAttribute('data-binding') === 'completeTodo')
    .map(completeAction);

  const deleteTodoStream = clicks
    .filter(evt => evt.target.getAttribute('data-binding') === 'deleteTodo')
    .map(deleteAction);

  const addTodoStream = Rx.Observable.merge(addTodoClicks, addTodoKeypress)
    .map(todoAction);

  return Rx.Observable.merge(addTodoStream, deleteTodoStream, completeTodoStream)
    .startWith({ type: undefined });
}

function createTodoAction({ source, domNode }) {
  return evt => ({ task: domNode.querySelector(source).value, type : 'addTodo' });
}

function deleteAction(evt) {
  return { type: 'deleteTodo', index: evt.target.getAttribute('data-index') };
}

function completeAction(evt) {
  return { type: 'completeTodo', index: evt.target.getAttribute('data-index') };
}

function reducer(state, action) {
  switch (action.type) {
    case 'addTodo':
      if (action.task) {
        const newTask = Immutable.fromJS({ task: action.task, complete: false });
        return state.updateIn(['todos'], todos => todos.insert(0, newTask));
      }
    case 'deleteTodo':
      return state.updateIn(['todos'], todos => todos.remove(action.index));
    case 'completeTodo':
      return state.updateIn(['todos'], todos => todos.update(action.index, todo => todo.updateIn(['complete'], complete => !complete)));
  }
  return state;
}

const initialState = Immutable.fromJS({
  todos: [{ task: 'Buy milk', complete: false }, { task: 'walk the dog', complete: false }]
});

const domNode = document.querySelector('#app');

const todoAppStream = getEventStream({
    domNode,
    todoAction: createTodoAction({ source: '[data-binding="todoInput"]', domNode }),
    deleteAction,
    completeAction
  })
  .scan(reducer, initialState)
  .subscribe(state => {
    domNode.innerHTML = getAppMarkup(state);
    domNode.querySelector('[data-binding="todoInput"]').focus();
  });

