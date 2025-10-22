import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Article} from '../../../../api';
import {getFromRoute} from '../../data-access/resolvers/get-from-route';
import {ARTICLE_RESOLVER_KEY} from '../../data-access/resolvers/resolve-article';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-article-page',
  imports: [
    MatCard,
    MatButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePage {
  protected readonly article = getFromRoute<Article>(ARTICLE_RESOLVER_KEY);
}
