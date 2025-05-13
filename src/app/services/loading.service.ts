import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  public loading = false;

  show() { this.loading = true; }
  hide() { this.loading = false; }
}
