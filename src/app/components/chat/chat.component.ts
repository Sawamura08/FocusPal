import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { chatBot } from '../../class/chat-bot';
import { combineLatest, Subscription } from 'rxjs';
import { chatEntry, histories } from '../../interfaces/message-model.interface';
import { MessageStoreService } from '../../service/message-store.service';
import { AicontentGenerationService } from '../../service/aicontent-generation.service';
import { AnimateOnceDirective } from '../../pipe/animate-once.directive';
declare var AOS: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnDestroy, OnInit, AfterViewInit {
  private subscriptionArr!: Subscription[];
  constructor(
    private convo: MessageStoreService,
    private gemini: AicontentGenerationService
  ) {
    this.chatBot = new chatBot();
    this.histories = this.chatBot.histories;

    /* SET UP THE HISTORY CONVERSATION */
    this.convo.setHistories(this.histories);
  }

  ngOnInit(): void {
    /* FETCH CONVO */
    this.fetchConversation();

    /* initialized the AOS LIBRARY */
    AOS.init();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  /* INHERIT CHABOT */
  protected chatBot: chatBot;

  /* FETCH EXISTING CONVERSATION */
  public conversation: chatEntry[] = [];
  private conversationSubscribe!: Subscription;
  public fetchConversation = () => {
    const getConversation = this.convo.getConversation();

    this.conversationSubscribe = combineLatest([getConversation]).subscribe({
      next: ([conversation]) => {
        this.conversation = conversation;
      },
      error: (err) => {
        console.error('Error Conversation Subscription', err);
      },
      complete: () => this.subscriptionArr.push(this.conversationSubscribe),
    });
  };

  /* TO OVERFLOW THE TEXTAREA DEPENDING ON NUMBER OF TEXT */
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  public overflowTextArea = () => {
    const textarea = this.textarea.nativeElement;
    textarea.style.height = '3.5rem';
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (textarea.scrollHeight > 200) {
      textarea.style.overflowY = 'scroll';
      textarea.style.height = '200px';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  };

  /* END */

  /* SUBMIT PROMPT */
  protected histories: histories[];
  protected userInput: string = '';
  public sendPrompt = () => {
    if (this.userInput != '') {
      this.convo.insertConversation(this.userInput);
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
      /* SENT PROMPT TO GEMINI */
      this.gemini.sendPromptRequest(this.userInput, this.histories).subscribe({
        next: (value) => {},
        error: (err) => console.error(err),
        complete: () => {
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        },
      });
    }

    this.userInput = '';
    setTimeout(() => {
      this.overflowTextArea();
    }, 100);
  };

  /* END */

  /* SCROLL THE CHAT BOX TO BOTTOM */
  @ViewChild('chatBox') chatBox!: ElementRef;
  public scrollToBottom = (): void => {
    this.chatBox.nativeElement.scrollTop =
      this.chatBox.nativeElement.scrollHeight;
  };
  /* END */

  /* CHAT SETTINGS */
  isChatSettingOpen: boolean = false;
  public toggleChatSetting = (): void => {
    this.isChatSettingOpen = !this.isChatSettingOpen;
  };

  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
}
