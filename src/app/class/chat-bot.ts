import { chatEntry } from '../interfaces/message-model.interface';

export class chatBot {
  /* CHAT HISTORY */
  public conversation: chatEntry[] = [
    {
      message: 'Hello, how can I assist you today?',
      response: "Hi there! I'm here to help you with your inquiries.",
      isAnimated: false,
    },
    {
      message: 'What features does your chatbot have?',
      response:
        'Our chatbot can provide recommendations, answer questions, and help with task management.',
      isAnimated: false,
    },
  ];
}
