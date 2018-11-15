import * as C from './constants';
export function testAction(data) {
    return {
      type: C.TEST_ACTION,
      data,
    };
  }