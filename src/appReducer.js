import * as C from './constants';
import { THIS_DAY } from './helper'

const initialState = {
  testReducer: {},
  formData: {
    instanceDate: THIS_DAY,
    issueDate: THIS_DAY,
  },
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case C.TEST_ACTION:
      return {...state, ...{ testReducer: action.data }};
    case C.UPDATE_FIRST_FORM_DATA:
       const formData = {...state.formData, ...action.data}
      return {...state, formData };
    case C.RESET_FORM_DATA:
     return initialState
    default:
      return state;
  }
}

export default appReducer;
