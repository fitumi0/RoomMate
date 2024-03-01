import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';
import { IUser } from '../interfaces/IUser';

export const USER_KEY = 'user';

export const changeUser = createAction('[USER] Change', props<IUser>());

const initialState: IUser = {
  id: '',
  username: '',
  email: '',
  token: '',
};

export const userReducer = createReducer(
  initialState,
  on(changeUser, (state, action) => ({
    ...state,
    ...action,
  }))
);

const featureSelector = createFeatureSelector<IUser>(USER_KEY);

export const userSelector = createSelector(featureSelector, (state) => state);
