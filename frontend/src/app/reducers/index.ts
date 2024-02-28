import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { IVideoUrl, VIDEOURL_KEY, videoUrlReducer } from './videoUrl';

export interface State {
  [VIDEOURL_KEY]: IVideoUrl;
}

export const reducers: ActionReducerMap<State> = {
  [VIDEOURL_KEY]: videoUrlReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
