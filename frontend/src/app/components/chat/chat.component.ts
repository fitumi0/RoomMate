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
    videoStreams: MediaStream[] = [];
    yourStream: MediaStream | null = null;
    msgData: FormGroup;
    @Input() roomId: string = '';
    userId: string | undefined = '';
    username: string | undefined = '';
    showChat: boolean = true;
    @Output() onShowChat = new EventEmitter<boolean>();
    subscriptionOnSocketMessage: Subscription | undefined;
    selectedOption: OptionsEnum = OptionsEnum.Chat;
    optionsEnum = OptionsEnum;
    inVideoChat = false;

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
                    console.log('user', user);

                    this.userId = user.id;
                    this.username = user.username || undefined;
                }
            });
    }

    addMessage(data: IMessage) {
        this.messages.push(data);
    }

    async joinVideoChat() {
        // this.socketService.sendMessage('joinVideoChat', {});
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        this.inVideoChat = true;

        this.addVideoPlayer(stream, true);
    }

    addVideoPlayer(stream: MediaStream, isYour: boolean = false) {
        new Promise(async (resolve) => {
            if (isYour) {
                resolve((this.yourStream = stream));
            } else {
                resolve(this.videoStreams.push(stream));
            }
        }).then(() => {
            this.cdr.detectChanges();
        });
    }

    onSubmit() {
        const data: IMessage = {
            roomId: this.roomId,
            senderId: this.userId,
            senderName: this.username,
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
