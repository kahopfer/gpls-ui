import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "./not-found.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";
import {UserListComponent} from "./user/user-list/user-list.component";
import {AddUserComponent} from "./user/add-user/add-user.component";
import {FamilyListComponent} from "./family-list/family-list.component";
import {FamilyDetailsComponent} from "./family-details/family-details.component";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {EnrollFamilyComponent} from "./enroll-family/enroll-family.component";
import {CheckInComponent} from "./check-in/check-in.component";
import {CheckOutComponent} from "./check-out/check-out.component";
import {CheckInDetailsComponent} from "./check-in-details/check-in-details.component";
import {CheckOutDetailsComponent} from "./check-out-details/check-out-details.component";
import {ManageRatesComponent} from "./manage-rates/manage-rates.component";
import {ResetPasswordComponent} from "./user/reset-password/reset-password.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/check-in',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'family-list',
    component: FamilyListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enroll-family',
    component: EnrollFamilyComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'family-details/:id',
    component: FamilyDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'create-user',
    component: AddUserComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password/:username',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'check-in',
    component: CheckInComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'check-out',
    component: CheckOutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'check-in-details',
    component: CheckInDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'check-out-details',
    component: CheckOutDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-rates',
    component: ManageRatesComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
