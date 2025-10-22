import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {Article, ArticlesService} from '../../../../api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ArticlesList} from '../components/articles-list/articles-list';
import {MatFormField, MatPrefix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-articles-list-page',
  imports: [
    ArticlesList,
    MatFormField,
    MatInput,
    MatIcon,
    MatPrefix,
    MatDivider,
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
    this.articlesApi.articlesList()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.articles.set(res.results);
      });
  }
}
