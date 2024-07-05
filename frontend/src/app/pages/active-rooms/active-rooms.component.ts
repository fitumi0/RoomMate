import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InfoBlockComponent } from '../../components/home-items/info-block.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import { CommonModule } from '@angular/common';
import { UUID } from 'crypto';
@Component({
    selector: 'app-active-rooms',
    standalone: true,
    imports: [
        InfoBlockComponent,
        CommonModule,
        HeaderComponent,
        FooterComponent,
        RouterLink,
    ],
    templateUrl: './active-rooms.component.html',
    styleUrl: './active-rooms.component.scss',
})
export class ActiveRoomsComponent implements OnInit {
    rooms: {
        id: string;
        name: string;
        createdDate: Date;
    }[] = [];

    constructor(
        private roomService: RoomService,
        private cdr: ChangeDetectorRef
    ) {}
    ngOnInit(): void {
        this.roomService.getPublicRooms().subscribe((data: any) => {
            data.map((room: any) => {
                if (room.public) {
                    this.rooms.push({
                        id: room.id,
                        name: room.name,
                        createdDate: room.createdAt,
                    });
                }
            });
            this.cdr.detectChanges();
        });
    }
}
