import * as C from './constants';

const initialState = {
  testReducer: {},
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case C.TEST_ACTION:
      const newState = {...state, ...{ testReducer: action.data }};
      return newState;
    default:
      return state;
  }
}

export default appReducer;
