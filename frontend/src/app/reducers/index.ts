import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { IVideoUrl, VIDEOURL_KEY, videoUrlReducer } from './videoUrl';
import { USER_KEY, userReducer } from './user';
import { IUser } from '../interfaces/IUser';

export interface State {
  [VIDEOURL_KEY]: IVideoUrl;
  [USER_KEY]: IUser;
}

export const reducers: ActionReducerMap<State> = {
  [VIDEOURL_KEY]: videoUrlReducer,
  [USER_KEY]: userReducer,
};

function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    // console.log('action', action);
    // console.log('state', state);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [logger] : [];
