import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { OptionsEnum } from './options.enum';
import { defineCustomElement, MediaPlayerElement } from 'vidstack/elements';
import { WebcamComponent } from '../webcam/webcam.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatIconModule,
    IconSizeDirective,
    ReactiveFormsModule,
    CommonModule,
    WebcamComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: IMessage[] = [];
  //   @ViewChild('playerElement') videoPlayers: ElementRef<MediaPlayerElement>[] = [];
  videoPlayers: MediaStream[] = [];
  msgData: FormGroup;
  @Input() roomId: string = '';
  userId: string | undefined = '';
  userName: string | undefined = '';
  showChat: boolean = true;
  @Output() onShowChat = new EventEmitter<boolean>();
  subscriptionOnSocketMessage: Subscription | undefined;
  selectedOption: OptionsEnum = OptionsEnum.Chat;
  optionsEnum = OptionsEnum;

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
    defineCustomElement(MediaPlayerElement);

    this.subscriptionOnSocketMessage = this.socketService
      .onEvent('message')
      .subscribe((data) => {
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

  joinVideoChat() {
    // this.socketService.sendMessage('joinVideoChat', {});
  }

  addVideoPlayer() {
    new Promise(async (resolve) => {
      resolve(
        this.videoPlayers.push(
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          })
        )
      );
    }).then(() => {
      console.log("videoPlayers ", this.videoPlayers);
      this.cdr.detectChanges();
    });


  }

  onSubmit() {
    const data: IMessage = {
      roomId: this.roomId,
      senderId: this.userId,
      senderName: this.userName,
      text: this.msgData.controls['msg'].value.trim(),
      date: new Date(),
    };
    this.socketService.sendMessage('message', data);
    this.addMessage(data);
    this.msgData.controls['msg'].setValue('');
  }

  toggleShow() {
    this.showChat = !this.showChat;
    this.onShowChat.emit(this.showChat);
  }

  setSelectedOption(option: OptionsEnum) {
    this.selectedOption = option;
  }
}
