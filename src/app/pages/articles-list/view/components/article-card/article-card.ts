import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Article} from '../../../../../api';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

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
  ],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCard {
  readonly article = input.required<Article>();
}
