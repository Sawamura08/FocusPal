import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { backendHistory, chatBot } from '../../class/chat-bot';
import {
  catchError,
  combineLatest,
  firstValueFrom,
  interval,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { chatEntry, histories } from '../../interfaces/message-model.interface';
import { MessageStoreService } from '../../service/message-store.service';
import { AicontentGenerationService } from '../../service/aicontent-generation.service';
import { AnimateOnceDirective } from '../../pipe/animate-once.directive';
import { confirm, confirmModal } from '../../interfaces/export.object';
import { PopModalService } from '../../service/pop-modal.service';
import { slideRight } from '../../animation/slide-right.animate';
import { NetworkStatusService } from '../../service/network-status.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConversationHistoryService } from '../../service/conversation-history.service';
import { SessionService } from '../../service/session.service';
declare var AOS: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  animations: [slideRight],
})
export class ChatComponent implements OnDestroy, OnInit, AfterViewInit {
  private subscriptionArr: Subscription[] = [];
  public destroyRef = inject(DestroyRef);
  constructor(
    private convo: MessageStoreService,
    private gemini: AicontentGenerationService,
    private popModal: PopModalService,
    private network: NetworkStatusService,
    private convoHistory: ConversationHistoryService,
    private session: SessionService
  ) {
    this.chatBot = new chatBot(convoHistory, session);
  }

  ngOnInit(): void {
    /* CHECK INTERNET CONNECTION */
    this.getInternetConnection();

    /* FETCH CONVO */
    this.fetchConversation();

    /* initialized the AOS LIBRARY */
    AOS.init();

    /* SUBSCRIBE TO CONFIRMATION MODAL SUBJECT */
    this.monitorConfirmationModal();

    /* SET SESSION */
    this.getSession();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  /* INHERIT CHABOT */
  protected chatBot: chatBot;
  public userId: number | undefined;
  public isLoadingOngoing: boolean = false;

  /* HISTORY */
  public setHistory = () => {
    this.convoHistory
      .getUpdatedHistory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.histories = value;
        /* SET UP THE HISTORY CONVERSATION */
        this.convo.setHistories(this.histories);
      });
  };

  /* FETCH EXISTING CONVERSATION */
  /* THIS ONLY FETCH THE CONVO IN BEHAVIOR SUBJECT */
  public conversation: chatEntry[] = [];
  public fetchConversation = () => {
    const getConversation = this.convo.getConversation();

    combineLatest([getConversation])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([conversation]) => {
          this.conversation = conversation;

          if (this.conversation.length === 0) {
            this.setHistory();
          }
        },
        error: (err) => {
          console.error('Error Conversation Subscription', err);
        },
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
  protected histories: histories[] = [];
  protected userInput: string = '';
  protected conversationData: backendHistory | undefined; // for saving in backend
  protected tempInputContainer: string = '';
  public sendPrompt = () => {
    const result = this.checkWhiteSpace();
    if (this.userInput != '' && result) {
      /* SET TEMPORARY CONTAINER FOR USER INPUT */
      this.tempInputContainer = this.userInput;
      this.convo.insertConversation(this.userInput);
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);

      this.conversationData = {
        userId: this.userId!,
        role: 'user',
        text: this.userInput,
      };
      if (
        this.conversationData != undefined &&
        this.conversationData.text != ''
      ) {
        /* SAVE THE CONVERSATION BEFORE SENDING THE PROMPT */
        this.convoHistory
          .saveConversation(this.conversationData)
          .pipe(switchMap((value: backendHistory) => this.promptGemini()))
          .subscribe({
            next: (value) => {
              // CHECK IF THE AI HAS A RESPONSE
              if (value != undefined || value != '') {
                this.saveAiReponse(value);
              }
            },
            error: (err) => console.error(err),
            complete: () => {
              setTimeout(() => {
                this.scrollToBottom();
              }, 100);
            },
          });
      }
    }
    this.userInput = '';
    setTimeout(() => {
      this.overflowTextArea();
    }, 100);
  };

  /* CHECK IS THERE IS ONLY WHITE SPACE ON USER INPUT */
  public checkWhiteSpace = () => {
    return this.userInput.trim().length > 0 ? true : false;
  };

  public saveAiReponse = (response: string) => {
    const responseData: backendHistory = {
      userId: this.userId!,
      role: 'model',
      text: response,
    };
    this.convoHistory
      .saveConversation(responseData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  };

  public promptGemini = () => {
    /* SENT PROMPT TO GEMINI */
    return this.gemini.sendPromptRequest(
      this.tempInputContainer,
      this.histories
    );
  };

  /* END */

  /* SCROLL THE CHAT BOX TO BOTTOM */
  @ViewChild('chatBox') chatBox!: ElementRef;
  public scrollToBottom = (): void => {
    try {
      this.chatBox.nativeElement.scrollTop =
        this.chatBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error! Fetching Scroll unsucessful', err);
    }
  };
  /* END */

  /* CHAT SETTINGS */
  isChatSettingOpen: boolean = false;
  confirmationData: confirmModal = confirm;
  public toggleChatSetting = (): void => {
    this.isChatSettingOpen = !this.isChatSettingOpen;
  };
  /* END */

  /* CONFIRMATION MODAL */
  isConfirmModalOpen: boolean = false;
  // FOR SUBSCRIPTION
  private confirmModalSubscription!: Subscription;
  public monitorConfirmationModal = (): void => {
    this.confirmModalSubscription = this.popModal
      .getConfirmModalStatus()
      .subscribe({
        next: (value) => (this.isConfirmModalOpen = value),
        error: (err) =>
          console.error('Error on Subscribe for Confirmation', err),
        complete: () => {
          this.subscriptionArr.push(this.confirmModalSubscription);
        },
      });
  };

  //CONFIRMATION MODAL TOGGLE
  public openConfirmModal = async (): Promise<void> => {
    this.isChatSettingOpen = false;
    this.popModal.setConfirmaModalStatus(true);

    const response = await this.userConfirmationResponse();

    if (response) {
      this.convoHistory
        .deleteConversation(this.userId!)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          if (value > 0) {
            this.convo.clearConversation();
            this.convoHistory.setNewHistory([]);
            this.conversation = [];
            this.histories = [];
          }
        });
      this.popModal.setConfirmaModalStatus(false);
    }
  };

  public userConfirmationResponse = async (): Promise<boolean> => {
    return firstValueFrom(
      this.popModal.getConfirmationModal().pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error in confirmation modal subscription', err);
          return of(false);
        })
      )
    );
  };

  /* END */

  /* CLOSE AI CHAT MODAL */
  public animateModal: boolean = true;
  public closeChatAi = (): void => {
    this.animateModal = false;
    setTimeout(() => {
      this.convo.clearConversation();
      this.popModal.toggleChatModal(false);
    }, 400);
  };

  /* END */

  /* CHECK INTERNET CONNECTION */
  public isInternetActive: boolean | null = null;
  private internetSubsription!: Subscription;

  public getInternetConnection = () => {
    this.internetSubsription = this.network.networkStatus$().subscribe({
      next: (value) => (this.isInternetActive = value),
      error: (err) => console.log('Error Subscribe network', err),
    });

    this.subscriptionArr.push(this.internetSubsription);
  };

  /* FETCH SESSION */

  public getSession = () => {
    this.session
      .getUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.userId = value?.userId));
  };

  ngOnDestroy(): void {
    if (this.subscriptionArr)
      this.subscriptionArr.forEach((subs) => subs.unsubscribe());
  }
}
