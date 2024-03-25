import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { userSelector } from '../../reducers/user';

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
  messages: IMessage[] = [];
  msgData: FormGroup;
  @Input() roomId: string = '';
  userId: string | undefined = '';
  userName: string | undefined = '';
  subscriptionOnSocketMessage: Subscription | undefined;
  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store
  ) {
    this.msgData = new FormGroup({
      msg: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.subscriptionOnSocketMessage = this.socketService
      .onEvent('message')
      .subscribe((data) => {
        console.log(data);
        this.addMessage(data);
        this.cdr.detectChanges();
      });

    this.store
      .select(userSelector)
      .pipe(take(1))
      .subscribe((user) => {
        if (user) {
          this.userId = user.id;
          this.userName = user.name || undefined;
        }
      });
  }

  addMessage(data: IMessage) {
    this.messages.push(data);
  }

  onSubmit() {
    const data: IMessage = {
      roomId: this.roomId,
      senderId: this.userId,
      senderName: this.userName,
      text: this.msgData.controls['msg'].value,
      date: new Date(),
    };
    this.socketService.sendMessage('message', data);
    this.addMessage(data);
    this.msgData.controls['msg'].setValue('');
  }
}
