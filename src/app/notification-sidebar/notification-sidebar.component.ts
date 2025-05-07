import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../services/notification.service';
import { SearchHistoryService } from '../services/search-history.service';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.css']
})
export class NotificationSidebarComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() isOpenMenu: boolean = false;
  @Output() close = new EventEmitter<void>();

  notifications: Notification[] = [];
  History: string[] = [];

  constructor(
    public notificationService: NotificationService,
    private searchHistoryService: SearchHistoryService
  ) {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  ngOnInit(): void {
    // Load history from service
    this.loadHistory();
  }

  loadHistory(): void {
    this.History = this.searchHistoryService.getHistory();
  }

  onClose(): void {
    this.close.emit();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.notificationService.removeNotification(id);
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  sendToSearchBar(item: string): void {
    this.searchHistoryService.setSearchTerm(item);
    this.onClose();
  }

  removeHistoryItem(item: string, event: MouseEvent): void {
    event.stopPropagation();
    this.searchHistoryService.removeFromHistory(item);
    this.loadHistory();
  }
}
