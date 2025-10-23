import {ChangeDetectionStrategy, Component, inject, OnInit, Signal} from '@angular/core';
import {ArticlesList} from '../components/articles-list/articles-list';
import {MatDivider} from '@angular/material/divider';
import {FormsModule} from '@angular/forms';
import {SearchBar} from '../components/search-bar/search-bar';
import {ArticlesListStore} from '../../data-access/store/articles-list.store';
import {injectDispatch} from '@ngrx/signals/events';
import {articlesListPageEvents} from '../../data-access/store/articles-list.events';
import {Article} from '../../../../api';

@Component({
  selector: 'app-articles-list-page',
  imports: [
    ArticlesList,
    MatDivider,
    FormsModule,
    SearchBar,
  ],
  templateUrl: './articles-list-page.html',
  styleUrl: './articles-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ArticlesListStore]
})
export class ArticlesListPage implements OnInit {
  private readonly store = inject(ArticlesListStore);
  private readonly dispatch = injectDispatch(articlesListPageEvents);

  protected readonly articles: Signal<Article[]> = this.store.articles;

  ngOnInit() {
    this.dispatch.opened();
  }
}
