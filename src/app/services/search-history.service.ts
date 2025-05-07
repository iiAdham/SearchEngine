import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  // BehaviorSubject to store the current search term from history
  private searchTermSource = new BehaviorSubject<string>('');

  // Observable that components can subscribe to
  searchTerm$ = this.searchTermSource.asObservable();

  constructor() { }

  // Method to update the search term
  setSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }

  // Get the current search term value
  getCurrentSearchTerm(): string {
    return this.searchTermSource.getValue();
  }

  // Get history from localStorage
  getHistory(): string[] {
    try {
      const historyData = localStorage.getItem('history');
      return historyData ? JSON.parse(historyData) : [];
    } catch (e) {
      console.error('Error parsing history from localStorage:', e);
      return [];
    }
  }

  // Save search term to history
  saveToHistory(term: string): void {
    if (!term || term.trim() === '') return;

    const history = this.getHistory();

    // Only add if not already in history
    if (!history.includes(term)) {
      history.push(term);
      localStorage.setItem('history', JSON.stringify(history));
    }
  }

  // Remove item from history
  removeFromHistory(term: string): void {
    const history = this.getHistory();
    const index = history.indexOf(term);

    if (index > -1) {
      history.splice(index, 1);
      localStorage.setItem('history', JSON.stringify(history));
    }
  }

  // Clear entire history
  clearHistory(): void {
    localStorage.setItem('history', JSON.stringify([]));
  }
}
