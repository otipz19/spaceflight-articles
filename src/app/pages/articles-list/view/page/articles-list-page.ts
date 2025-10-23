import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {Article, ArticlesListRequestParams, ArticlesService} from '../../../../api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ArticlesList} from '../components/articles-list/articles-list';
import {MatDivider} from '@angular/material/divider';
import {FormsModule} from '@angular/forms';
import {SearchBar} from '../components/search-bar/search-bar';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesListPage implements OnInit {
  private readonly articlesApi = inject(ArticlesService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly articles = signal<Article[]>([]);

  ngOnInit() {
    this.loadArticles();
  }

  protected loadArticles(searchValue?: string) {
    const params: ArticlesListRequestParams = {};

    if(searchValue) {
      const keywords = searchValue.toLowerCase().split(" ").join(",");
      params.titleContainsOne = keywords;
      params.summaryContainsOne = keywords;
    }

    this.articlesApi.articlesList(params)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.articles.set(res.results);
      });
  }
}
