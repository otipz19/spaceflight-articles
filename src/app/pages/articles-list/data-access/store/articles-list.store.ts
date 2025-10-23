import {Article, ArticlesListRequestParams, ArticlesService} from '../../../../api';
import {signalStore, withComputed, withState} from '@ngrx/signals';
import {Events, on, withEffects, withReducer} from '@ngrx/signals/events';
import {articlesApiEvents, articlesListPageEvents} from './articles-list.events';
import {computed, inject} from '@angular/core';
import {switchMap} from 'rxjs';
import {mapResponse} from '@ngrx/operators';

type ArticlesListState = {
  articles: Array<Article>,
  isLoading: boolean,
  searchQuery: string,
  searchRegex: RegExp | undefined,
};

export const ArticlesListStore = signalStore(
  withState<ArticlesListState>({articles: [], isLoading: false, searchQuery: '', searchRegex: undefined}),

  withComputed((store) => ({
    searchRegex: computed(() => {
      const query = store.searchQuery();
      if (!query) {
        return undefined;
      }
      return new RegExp(store.searchQuery().split(" ").join("|"), "gi");
    })
  })),

  withReducer(
    on(
      articlesListPageEvents.opened,
      () => ({isLoading: true})
    ),
    on(
      articlesListPageEvents.searchQueryChanged,
      ({payload: searchQuery}) => {
        if (!searchQuery) {
          return {isLoading: true, searchQuery};
        }
        const searchRegex = new RegExp(searchQuery.split(" ").join("|"), "gi");
        return {isLoading: true, searchQuery, searchRegex};
      }
    ),
    on(
      articlesApiEvents.requestSuccess,
      (event, state) => {
        const regex = state.searchRegex;
        if (!regex) {
          return {articles: event.payload.results, isLoading: false};
        }

        function countMatches(str: string) {
          return regex ? [...str.matchAll(regex)].length : 0;
        }

        const articles = event.payload.results.map(article => {
          const titleMatches = countMatches(article.title);
          const summaryMatches = countMatches(article.summary);
          return {...article, matches: titleMatches * 2 + summaryMatches};
        });

        articles.sort((a, b) => b.matches - a.matches);

        return {articles, isLoading: false};
      }
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
