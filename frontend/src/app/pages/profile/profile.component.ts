import { Component, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Store } from '@ngrx/store';
import { changeUser } from '../../reducers/user';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NameUpdateComponent } from '../../components/name-update/name-update.component';
import { UsernameUpdateComponent } from '../../components/username-update/username-update.component';
import { PasswordUpdateComponent } from '../../components/password-update/password-update.component';
import { AccordionComponent } from '../../components/accordion/accordion.component';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserModalComponent } from '../../components/delete-user-modal/delete-user-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, AccordionComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnDestroy {
  
  forms: { title: string; component: any }[] = [
    { title: 'Update Name', component: NameUpdateComponent },
    { title: 'Update Username', component: UsernameUpdateComponent },
    { title: 'Update Password', component: PasswordUpdateComponent },
  ];

  $unsubscribe = new Subject<void>();
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    public readonly auth: AuthService,
    private readonly dialog: MatDialog
  ) {}


  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '320px',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().pipe(takeUntil(this.$unsubscribe)).subscribe();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
