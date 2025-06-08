import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-notification',
  imports: [],
  templateUrl: './message-notification.component.html',
  styleUrl: './message-notification.component.css'
})
export class MessageNotificationComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';

  getNotificationClasses(): string {
    const baseClasses = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';

    if (this.type === 'success') {
      return `${baseClasses} bg-green-500 text-white`;
    } else {
      return `${baseClasses} bg-red-500 text-white`;
    }
  }
}
