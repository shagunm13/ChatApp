import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/index'
const configureStore = () => {

    return createStore(rootReducer, composeWithDevTools());
}

export default configureStore;