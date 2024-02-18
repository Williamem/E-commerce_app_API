import { createStore, combineReducers } from 'redux';
import productReducer from '../reducers/productReducer';
import userReducer from '../reducers/userReducer';

const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default rootReducer;