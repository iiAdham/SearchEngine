import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {
  safeUrl?: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const url = this.route.snapshot.queryParamMap.get('url');
    const highlight = this.route.snapshot.queryParamMap.get('highlight');

    if (url) {
      const separator = url.includes('?') ? '&' : '?';
      const fullUrl = highlight ? `${url}${separator}highlight=${highlight}` : url;

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    }
  }
}
