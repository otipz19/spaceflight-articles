import {Routes} from '@angular/router';
import {ArticlesListPage} from './pages/articles-list/view/page/articles-list-page';
import {
  ARTICLE_ID_ROUTE_PARAM,
  ARTICLE_RESOLVER_KEY,
  resolveArticle
} from './pages/article/data-access/resolvers/resolve-article';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'articles'
  },
  {
    path: 'articles',
    children: [
      {
        path: '',
        component: ArticlesListPage
      },
      {
        path: `:${ARTICLE_ID_ROUTE_PARAM}`,
        resolve: {[ARTICLE_RESOLVER_KEY]: resolveArticle},
        loadComponent: () => import('./pages/article/view/page/article-page').then(r => r.ArticlePage)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/view/page/not-found-page').then(r => r.NotFoundPage)
  }
];
