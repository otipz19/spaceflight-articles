import {inject, Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'highlightSearchMatches',
  standalone: true
})
export class HighlightSearchMatchesPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(text: string, regex: RegExp | undefined): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.useRegex(text, regex)) ?? '';
  }

  private useRegex(text: string, regex: RegExp | undefined): string {
    if(!regex) {
      return text;
    }
    return text.replaceAll(regex, `<span class="search-highlight">$&</span>`);
  }
}
