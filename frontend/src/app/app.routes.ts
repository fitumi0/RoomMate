import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RoomComponent } from './pages/room/room.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { roomValidateGuard } from './guards/room.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Home' },
    {
        path: 'signin',
        loadComponent: () =>
            import('./pages/signin/signin.component').then(
                (m) => m.SigninComponent
            ),
        title: 'Sign in',
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./pages/signup/signup.component').then(
                (m) => m.SignupComponent
            ),
        title: 'Sign in',
    },
    {
        path: 'room/:uid',
        loadComponent: () =>
            import('./pages/room/room.component').then((m) => m.RoomComponent),
        canActivate: [roomValidateGuard()],
        title: 'Room',
    },
    {
        path: 'active-rooms',
        loadComponent: () =>
            import('./pages/active-rooms/active-rooms.component').then(
                (m) => m.ActiveRoomsComponent
            ),
        title: 'Active rooms',
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
        canActivate: [authGuard()],
    },
    { path: '**', redirectTo: '' },
];
