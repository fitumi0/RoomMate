import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconSizeDirective } from '../../directives/icon-size.directive';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IMessage } from '../../interfaces/IMessage';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatIconModule,
    IconSizeDirective,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  messagesTest: IMessage[] = [
    {
      id: '1',
      senderId: '1',
      senderName: 'John',
      text: 'Hi',
      date: new Date(),
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'John',
      text: 'Test',
      date: new Date(),
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John',
      text: 'aaaaaaaaaaaaaa',
      date: new Date(),
    },
    {
      id: '1',
      senderId: '1',
      senderName: 'John',
      text: 'Hi',
      date: new Date(),
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'John',
      text: 'Test',
      date: new Date(),
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John',
      text: 'aaaaaaaaaaaaaa',
      date: new Date(),
    },
    {
      id: '1',
      senderId: '1',
      senderName: 'John',
      text: 'Hi',
      date: new Date(),
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'John',
      text: 'Test',
      date: new Date(),
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John',
      text: 'aaaaaaaaaaaaaa',
      date: new Date(),
    },
    {
      id: '1',
      senderId: '1',
      senderName: 'John',
      text: 'Hi',
      date: new Date(),
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'John',
      text: 'Test',
      date: new Date(),
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John',
      text: 'aaaaaaaaaaaaaa',
      date: new Date(),
    },
    {
      id: '1',
      senderId: '1',
      senderName: 'John',
      text: 'Hi',
      date: new Date(),
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'John',
      text: 'Test',
      date: new Date(),
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John',
      text: 'aaaaaaaaaaaaaa',
      date: new Date(),
    },
    {
      id: '1',
      senderId: '1',
      senderName: 'John',
      text: 'Hi',
      date: new Date(),
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'John',
      text: 'Test',
      date: new Date(),
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John',
      text: 'aaaaaaaaaaaaaa',
      date: new Date(),
    },
  ];
  msgData: FormGroup;
  constructor() {
    this.msgData = new FormGroup({
      msg: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
