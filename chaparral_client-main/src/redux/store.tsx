import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import UploadFile from './uploadFile/uploadFile.reducer'
import { thunk } from 'redux-thunk'

const rootReducer = combineReducers({
  UploadFile,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
export default store
