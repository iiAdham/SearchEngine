
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  constructor(private toastr: ToastrService) { }

  get unreadCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  addNotification(title: string, content: string): void {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      content,
      timestamp: new Date(),
      read: false
    };

    this.notifications.next([newNotification, ...this.notifications.value]);

    // Display toast notification
    this.toastr.success(content, title);
  }

  removeNotification(id: string): void {
    const updatedNotifications = this.notifications.value.filter(
      notification => notification.id !== id
    );
    this.notifications.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const updatedNotifications = this.notifications.value.map(
      notification => ({ ...notification, read: true })
    );
    this.notifications.next(updatedNotifications);
  }

  markAsRead(id: string): void {
    const updatedNotifications = this.notifications.value.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    this.notifications.next(updatedNotifications);
  }
}
