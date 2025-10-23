import {ChangeDetectionStrategy, Component, inject, input, Signal} from '@angular/core';
import {Article} from '../../../../../api';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ArticlesListStore} from '../../../data-access/store/articles-list.store';
import {HighlightSearchMatchesPipe} from '../../pipes/highlight-search-matches.pipe';

@Component({
  selector: 'app-article-card',
  imports: [
    MatCard,
    MatCardContent,
    MatCardImage,
    MatButton,
    MatIcon,
    DatePipe,
    SlicePipe,
    RouterLink,
    HighlightSearchMatchesPipe,
  ],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCard {
  private readonly store = inject(ArticlesListStore);
  protected readonly searchRegex: Signal<RegExp | undefined> = this.store.searchRegex;

  readonly article = input.required<Article>();
}
