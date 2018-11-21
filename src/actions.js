import * as C from './constants';
export function testAction(data) {
    return {
      type: C.TEST_ACTION,
      data,
    };
  }

  export function updateFirstForm(data) {
    return {
      type: C.UPDATE_FIRST_FORM_DATA,
      data,
    };
  }

  export function resetForm() {
    return {
      type: C.RESET_FORM_DATA,
    };
  }