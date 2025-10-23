import {Article, ArticlesListRequestParams, ArticlesService} from '../../../../api';
import {signalStore, withState} from '@ngrx/signals';
import {Events, on, withEffects, withReducer} from '@ngrx/signals/events';
import {articlesApiEvents, articlesListPageEvents} from './articles-list.events';
import {inject} from '@angular/core';
import {switchMap} from 'rxjs';
import {mapResponse} from '@ngrx/operators';

type ArticlesListState = {
  articles: Array<Article>,
  isLoading: boolean,
  searchQuery: string,
};

export const ArticlesListStore = signalStore(
  withState<ArticlesListState>({articles: [], isLoading: false, searchQuery: ''}),

  withReducer(
    on(
      articlesListPageEvents.opened,
      () => ({isLoading: true})
    ),
    on(
      articlesListPageEvents.searchQueryChanged,
      ({payload: searchQuery}) => ({isLoading: true, searchQuery})
    ),
    on(
      articlesApiEvents.requestSuccess,
      ({payload}) => ({articles: payload.results, isLoading: false})
    ),
    on(
      articlesApiEvents.requestError,
      () => ({isLoading: false})
    )
  ),

  withEffects((store, events = inject(Events), api = inject(ArticlesService)) => ({
    loadArticles$: events
      .on(articlesListPageEvents.opened, articlesListPageEvents.searchQueryChanged)
      .pipe(
        switchMap(() => {
          const searchQuery = store.searchQuery();

          const params: ArticlesListRequestParams = {};
          if (searchQuery) {
            const keywords = searchQuery.toLowerCase().split(" ").join(",");
            params.titleContainsOne = keywords;
            params.summaryContainsOne = keywords;
          }

          return api.articlesList(params)
            .pipe(
              mapResponse({
                next: res => articlesApiEvents.requestSuccess(res),
                error: () => articlesApiEvents.requestError()
              })
            );
        })
      ),
  }))
);

export type ArticlesListStore = InstanceType<typeof ArticlesListStore>;
