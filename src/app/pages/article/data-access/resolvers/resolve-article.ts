import {RedirectCommand, ResolveFn, Router} from '@angular/router';
import {Article, ArticlesService} from '../../../../api';
import {inject} from '@angular/core';
import {catchError, EMPTY} from 'rxjs';

export const ARTICLE_ID_ROUTE_PARAM = "articleId";
export const ARTICLE_RESOLVER_KEY = "ARTICLE_RESOLVER_KEY";

export const resolveArticle: ResolveFn<Article> = (route) => {
  const router = inject(Router);

  const id = Number(route.paramMap.get(ARTICLE_ID_ROUTE_PARAM));
  if (isNaN(id)) {
    return new RedirectCommand(router.parseUrl('not-found'));
  }

  const api = inject(ArticlesService);

  return api.articlesRetrieve({id})
    .pipe(
      catchError(() => {
        router.navigate(['not-found']);
        return EMPTY;
      }),
    );
}
