import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';

export const VIDEOURL_KEY = 'videoUrl';

export const changeUrl = createAction('[VIDEOURL] Change', props<IVideoUrl>());

export interface IVideoUrl {
  url: string;
}

const initialState: IVideoUrl = {
  url: '',
};

export const videoUrlReducer = createReducer(
  initialState,
  on(changeUrl, (state, action) => ({
    ...state,
    url: action.url,
  }))
);

const featureSelector = createFeatureSelector<IVideoUrl>(VIDEOURL_KEY);
export const videoUrlSelector = createSelector(
  featureSelector,
  (state) => state.url
);
