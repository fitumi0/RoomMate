import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { SocketService } from '../../services/sockets/socket.service';
import { Subscription } from 'rxjs';

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
export class ChatComponent implements OnInit {
  private eventSubscription!: Subscription;
  messages: IMessage[] = [];
  msgData: FormGroup;
  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {
    this.msgData = new FormGroup({
      msg: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.eventSubscription = this.socketService
      .onEvent('message')
      .subscribe((data) => {
        console.log(data);

        this.addMessage(data);

        this.cdr.detectChanges();
      });
  }

  addMessage(data: IMessage) {
    this.messages.push(data);
  }

  onSubmit() {
    let data = {
      roomId: '9ac8bcea-4707-4471-b7ba-c037196ee49e',
      senderId: '1',
      senderName: 'testUser',
      text: this.msgData.controls['msg'].value,
      date: new Date(),
    };
    this.socketService.sendMessage('message', data);

    this.addMessage(data);
  }
}
