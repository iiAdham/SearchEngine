import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() saveSettings = new EventEmitter<any>();
  @Input() isOpen = false;

  // Light theme settings
  lightTheme = {
    background: '#8F87F1',
    particles: ['#F7374F', '#FFF2F2', '#FFD0C7', '#E69DB8']
  };

  // Dark theme settings
  darkTheme = {
    background: '#201e30',
    particles: ['#fbfcca', '#d7f3fe', '#ffd0a7']
  };

  // Current active tab
  activeTab = 'light';

  isLoading = false;

  constructor(private loadingService:LoadingService) { }

  ngOnInit(): void {
    // Load saved settings from localStorage if available
    this.loadSavedSettings();
  }

  loadSavedSettings(): void {
    const savedLightTheme = localStorage.getItem('lightThemeSettings');
    const savedDarkTheme = localStorage.getItem('darkThemeSettings');

    if (savedLightTheme) {
      this.lightTheme = JSON.parse(savedLightTheme);
    }

    if (savedDarkTheme) {
      this.darkTheme = JSON.parse(savedDarkTheme);
    }
  }

  open(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.close.emit();
    this.isOpen = false;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  addParticleColor(theme: 'light' | 'dark'): void {
    if (theme === 'light') {
      this.lightTheme.particles.push('#FFFFFF');
    } else {
      this.darkTheme.particles.push('#FFFFFF');
    }
  }

  removeParticleColor(theme: 'light' | 'dark', index: number): void {
    if (theme === 'light' && this.lightTheme.particles.length > 1) {
      this.lightTheme.particles.splice(index, 1);
    } else if (theme === 'dark' && this.darkTheme.particles.length > 1) {
      this.darkTheme.particles.splice(index, 1);
    }
  }

  onSave(): void {
    this.isLoading = true;

    // Save to localStorage
    localStorage.setItem('lightThemeSettings', JSON.stringify(this.lightTheme));
    localStorage.setItem('darkThemeSettings', JSON.stringify(this.darkTheme));

    const settings = {
      light: this.lightTheme,
      dark: this.darkTheme
    };

    // Use loading service for app-wide loading indicator
    this.loadingService.show();

    // Emit settings to parent component
    this.saveSettings.emit(settings);

    // Close modal and reset loading state after a delay
    setTimeout(() => {
      this.isLoading = false;
      this.loadingService.hide();
      this.close.emit();
      this.isOpen = false;
    }, 1000);
  }

  resetToDefaults(): void {
    if (this.activeTab === 'light') {
      this.lightTheme = {
        background: '#8F87F1',
        particles: ['#F7374F', '#FFF2F2', '#FFD0C7', '#E69DB8']
      };
    } else {
      this.darkTheme = {
        background: '#201e30',
        particles: ['#fbfcca', '#d7f3fe', '#ffd0a7']
      };
    }
  }
}
