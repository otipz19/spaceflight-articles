import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Article} from '../../../../../api';
import {ArticleCard} from '../article-card/article-card';

@Component({
  selector: 'app-articles-list',
  imports: [
    ArticleCard
  ],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesList {
  readonly articles = input.required<Article[]>();
}
