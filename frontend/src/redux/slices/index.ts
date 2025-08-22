import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user.ts'


const rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;
