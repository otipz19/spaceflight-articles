import {eventGroup} from '@ngrx/signals/events';
import {type} from '@ngrx/signals';
import {PaginatedArticleList} from '../../../../api';

export const articlesListPageEvents = eventGroup({
  source: 'Articles List Page',
  events: {
    opened: type<void>(),
    searchQueryChanged: type<string>(),
  }
});

export const articlesApiEvents = eventGroup({
  source: 'Articles API',
  events: {
    requestSuccess: type<PaginatedArticleList>(),
    requestError: type<void>(),
  }
});
