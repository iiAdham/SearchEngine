import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs';
import { Subscription } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { SearchHistoryService } from '../services/search-history.service';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ]),
    trigger('lightSpeedInRight', [
      transition(':enter', [
        animate('700ms ease-out', keyframes([
          style({ transform: 'translateX(-100%) skewX(  30deg)', opacity: 0, offset: 0 }),
          style({ transform: 'translateX(20%) skewX(-20deg)', opacity: 1, offset: 0.6 }),
          style({ transform: 'translateX(0%) skewX(0)', opacity: 1, offset: 1.0 })
        ]))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%) skewX(30deg)', opacity: 0 }))
      ])
    ])
  ]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @ViewChild('resultContainer') resultContainer!: ElementRef;

  startSound!: HTMLAudioElement;
  stopSound!: HTMLAudioElement;
  value: string = "";
  allData: any[] = []; // Store all results
  data: any[] = [];    // Store displayed results
  recognition: any;
  isRecording = false;
  hasSearched: boolean = false;

  // Pagination parameters
  pageSize: number = 20;
  currentPage: number = 0;
  isLoading: boolean = false;
  noMoreData: boolean = false;

  // Subscription to handle search history clicks
  private searchTermSubscription: Subscription | null = null;

  constructor(private apiService: ApiService, public loadingService: LoadingService, private searchHistoryService: SearchHistoryService) {
    this.startSound = new Audio('assets/sounds/playRec.aac');
    this.stopSound = new Audio('assets/sounds/stopRec.aac');
    this.startSound.volume = 1; // Maximum volume (range 0 to 1)
    this.stopSound.volume = 1; // Maximum volume (range 0 to 1)

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionClass();
    this.recognition.lang = 'ar-EG';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      this.value = spokenText;
      this.getAll(this.value);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };
  }

  ngOnInit(): void {
    // Subscribe to the search term changes from the history sidebar
    this.searchTermSubscription = this.searchHistoryService.searchTerm$.subscribe(term => {
      if (term) {
        this.value = term;
        this.getAll(term);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.searchTermSubscription) {
      this.searchTermSubscription.unsubscribe();
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 20) {
      this.loadMoreResults();
    }
  }

  loadMoreResults() {
    if (this.isLoading || this.noMoreData) return;

    this.isLoading = true;
    this.currentPage++;

    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (startIndex >= this.allData.length) {
      this.noMoreData = true;
      this.isLoading = false;
      return;
    }

    const nextBatch = this.allData.slice(startIndex, endIndex);
    this.data = [...this.data, ...nextBatch];
    this.isLoading = false;
  }

  getAll(input: any) {
    this.value = input;
    console.log(this.value);

    if (this.value.length < 1) {
      this.hasSearched = false;
      return;
    }

    // Set the search flag to true
    this.hasSearched = true;

    // Reset pagination
    this.currentPage = 0;
    this.noMoreData = false;
    this.data = [];
    this.allData = [];

    this.apiService.getAll(this.value)
    .pipe(
      map((response: any[]) => {
        const results: { url: string, count: number }[] = [];

        response.forEach(item => {
          const links: string[] = item.description.split(',').map((link: any) => link.trim());

          links.forEach(link => {
              const lastColonIndex = link.lastIndexOf(':');
              const url = link.slice(0, lastColonIndex).trim();
              const count = parseInt(link.slice(lastColonIndex + 1).trim(), 10);

              if (!isNaN(count)) {
                results.push({ url, count });
              }
          });
        });
        return results;
      })
    )
    .subscribe(filteredResults => {
      this.allData = filteredResults;
      // Load only first page initially
      this.data = this.allData.slice(0, this.pageSize);
      console.log(this.data);

      // Save search term to history
      this.searchHistoryService.saveToHistory(this.value);
    });
  }

  startListening() {
    if (this.isRecording) {
      this.stopSound.play();
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.startSound.play();
      this.recognition.start();
      this.isRecording = true;
    }
  }
}
