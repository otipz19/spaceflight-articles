import { Routes } from '@angular/router';
import {ArticlesListPage} from './pages/articles-list/view/page/articles-list-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'articles'
  },
  {
    path: 'articles',
    component: ArticlesListPage
  }
];
