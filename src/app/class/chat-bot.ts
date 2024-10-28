import { chatEntry, histories } from '../interfaces/message-model.interface';

export class chatBot {
  /* AI HISTORY */
  public histories: histories[] = [
    {
      role: 'user',
      parts: [{ text: 'Hello' }],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Hi there! I’m Sydney, your task management assistant. How could I help you?',
        },
      ],
    },
  ];
}
