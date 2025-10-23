import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {injectDispatch} from '@ngrx/signals/events';
import {articlesListPageEvents} from '../../../data-access/store/articles-list.events';
import {ArticlesListStore} from '../../../data-access/store/articles-list.store';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {
  private readonly store = inject(ArticlesListStore);
  private readonly dispatch = injectDispatch(articlesListPageEvents);

  protected readonly searchQuery: Signal<string> = this.store.searchQuery;
  private readonly searchQueryChange$ = new Subject<string>();

  protected onSearchQueryChanged(value: string) {
    this.searchQueryChange$.next(value);
  }

  constructor() {
    this.searchQueryChange$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(v => this.dispatch.searchQueryChanged(v));
  }
}
