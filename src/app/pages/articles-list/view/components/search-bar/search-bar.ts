import {ChangeDetectionStrategy, Component, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';

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
  readonly search = output<string>();
  protected readonly searchInput = signal<string>("");

  constructor() {
    toObservable(this.searchInput)
      .pipe(
        takeUntilDestroyed(),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(v => this.search.emit(v));
  }
}
