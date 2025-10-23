import {eventGroup} from '@ngrx/signals/events';
import {type} from '@ngrx/signals';
import {PaginatedArticleList} from '../../../../api';
import {PageEvent} from '@angular/material/paginator';

export const articlesListPageEvents = eventGroup({
  source: 'Articles List Page',
  events: {
    opened: type<void>(),
    searchQueryChanged: type<string>(),
    paginationChanged: type<PageEvent>()
  }
});

export const articlesApiEvents = eventGroup({
  source: 'Articles API',
  events: {
    requestSuccess: type<PaginatedArticleList>(),
    requestError: type<void>(),
  }
});
