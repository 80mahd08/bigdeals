import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent implements OnInit {

  contacts = [
    { id: 1, name: 'Jean Dupont', avatar: 'assets/images/users/avatar-1.jpg', status: 'online', time: '12:00', unread: 2 },
    { id: 2, name: 'ImmoTech', avatar: 'assets/images/users/avatar-2.jpg', status: 'offline', time: 'Hier', unread: 0 },
    { id: 3, name: 'Alice Martin', avatar: 'assets/images/users/avatar-3.jpg', status: 'online', time: 'Lun', unread: 0 }
  ];

  selectedContact: any = null;
  newMessage: string = '';
  activeChat: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  selectContact(contact: any) {
    this.selectedContact = contact;
    this.activeChat = [
      { from: 'them', text: 'Bonjour, est-ce que l\'article est toujours disponible ?', time: '10:00' },
      { from: 'me', text: 'Oui, tout à fait !', time: '10:05' },
      { from: 'them', text: 'Super, quel est votre dernier prix ?', time: '10:10' }
    ];
    contact.unread = 0;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.activeChat.push({
        from: 'me',
        text: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.newMessage = '';
      
      // Simulate reply
      setTimeout(() => {
        this.activeChat.push({
          from: 'them',
          text: 'D\'accord, je reviens vers vous vite.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 1000);
    }
  }

}
