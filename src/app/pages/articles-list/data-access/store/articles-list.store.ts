import {Article, ArticlesListRequestParams, ArticlesService} from '../../../../api';
import {signalStore, withComputed, withState} from '@ngrx/signals';
import {Events, on, withEffects, withReducer} from '@ngrx/signals/events';
import {articlesApiEvents, articlesListPageEvents} from './articles-list.events';
import {computed, inject} from '@angular/core';
import {switchMap, tap} from 'rxjs';
import {mapResponse} from '@ngrx/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

export const PAGE_SIZE_OPTIONS = [5, 10, 20];

type ArticlesListState = {
  articles: Array<Article>,
  isLoading: boolean,
  searchQuery: string,
  searchRegex: RegExp | undefined,
  totalArticles: number,
  pageSize: number,
  pageIndex: number
};

export const ArticlesListStore = signalStore(
    withState<ArticlesListState>({
      articles: [],
      isLoading: false,
      searchQuery: '',
      searchRegex: undefined,
      totalArticles: 0,
      pageSize: PAGE_SIZE_OPTIONS[0],
      pageIndex: 0
    }),

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
            return {isLoading: true, searchQuery, searchRegex: undefined, pageIndex: 0};
          }
          const searchRegex = new RegExp(searchQuery.split(" ").join("|"), "gi");
          return {isLoading: true, searchQuery, searchRegex, pageIndex: 0};
        }
      ),

      on(
        articlesListPageEvents.paginationChanged,
        ({payload: pageEvent}) => {
          const {pageIndex, pageSize} = pageEvent;
          return {pageIndex, pageSize, isLoading: true};
        }
      ),

      on(
        articlesApiEvents.requestSuccess,
        (event, state) => {
          const regex = state.searchRegex;
          if (!regex) {
            return {articles: event.payload.results, isLoading: false, totalArticles: event.payload.count};
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

          return {articles, isLoading: false, totalArticles: event.payload.count};
        }
      ),

      on(
        articlesApiEvents.requestError,
        () => ({isLoading: false})
      )
    ),

    withEffects((
      store,
      events = inject(Events),
      api = inject(ArticlesService),
      snackBar = inject(MatSnackBar
      )) => ({
      loadArticles$: events
        .on(articlesListPageEvents.opened, articlesListPageEvents.searchQueryChanged, articlesListPageEvents.paginationChanged)
        .pipe(
          switchMap(() => {
            const searchQuery = store.searchQuery();

            const params: ArticlesListRequestParams = {
              limit: store.pageSize(),
              offset: store.pageIndex() * store.pageSize()
            };

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

      showErrorNotification$: events
        .on(articlesApiEvents.requestError)
        .pipe(
          tap(() => {
            snackBar.open('Request failed. Something went wrong...', 'OK', {
              duration: 1500,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            })
          })
        )
    }))
  )
;

export type ArticlesListStore = InstanceType<typeof ArticlesListStore>;
