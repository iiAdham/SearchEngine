import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-ring',
  templateUrl: './notification-ring.component.html',
  styleUrls: ['./notification-ring.component.css']
})
export class NotificationRingComponent {
  @Output() openSidebar = new EventEmitter<void>();
  @Output() menuSidebar = new EventEmitter<void>();

  constructor(public notificationService: NotificationService) { }

  onClick(): void {
    this.openSidebar.emit();
  }
  onClickMenu(): void {
    this.menuSidebar.emit();
  }
}
