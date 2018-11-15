import { createStore } from 'redux'
import rootApp from './reducer'
export const store = createStore(rootApp)