import { Component } from '@angular/core';
import { chatBot } from '../../class/chat-bot';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  constructor() {
    this.chatBot = new chatBot();
  }

  protected chatBot: chatBot;
}
