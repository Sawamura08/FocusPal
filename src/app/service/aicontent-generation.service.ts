import { Injectable } from '@angular/core';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { histories } from '../interfaces/message-model.interface';
import { Observable, catchError, defer, tap, throwError } from 'rxjs';
import { geminiConfig } from '../interfaces/gemini-config';
import { MessageStoreService } from './message-store.service';

@Injectable({
  providedIn: 'root',
})
export class AicontentGenerationService {
  constructor(private storeConvo: MessageStoreService) {}

  /* SEND REQUEST */
  public generateContent = (
    message: string,
    histories: histories[]
  ): Observable<string> => {
    // this only creates observable when it's time to send prompt to AI
    return defer(() => {
      const modelName = geminiConfig.model;
      const apiKey = geminiConfig.apiKey;
      const systemInstruction = geminiConfig.systemInstructions;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      };

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: histories,
      });

      return chat.sendMessage(message).then((result) => result.response.text());
    });
  };
  /* END */

  /* CALL THE GEMINI AND UPDATE CONVERSATION  */
  public sendPromptRequest = (
    message: string,
    histories: histories[]
  ): Observable<string> => {
    return this.generateContent(message, histories).pipe(
      tap((result: string) => {
        const response = result;
        this.storeConvo.updateConversation(response);
      }),
      catchError((err) => {
        console.error("There's an error", err);
        return throwError(() => err);
      })
    );
  };
}
