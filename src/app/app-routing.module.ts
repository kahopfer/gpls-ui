import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "./not-found.component";
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";
import {LoginComponent} from "./components/login/login.component";
import {FamilyListComponent} from "./components/family-list/family-list.component";
import {EnrollFamilyComponent} from "./components/enroll-family/enroll-family.component";
import {FamilyDetailsComponent} from "./components/family-details/family-details.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {AddUserComponent} from "./components/add-user/add-user.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {CheckInComponent} from "./components/check-in/check-in.component";
import {CheckOutComponent} from "./components/check-out/check-out.component";
import {CheckInDetailsComponent} from "./components/check-in-details/check-in-details.component";
import {CheckOutDetailsComponent} from "./components/check-out-details/check-out-details.component";
import {ManageRatesComponent} from "./components/manage-rates/manage-rates.component";
import {InvoiceListComponent} from "./components/invoice-list/invoice-list.component";
import {CreateInvoiceComponent} from "./components/create-invoice/create-invoice.component";
import {CreateInvoiceDetailsComponent} from "./components/create-invoice-details/create-invoice-details.component";

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
    path: 'invoice-list',
    component: InvoiceListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'create-invoice',
    component: CreateInvoiceComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'create-invoice-details/:id',
    component: CreateInvoiceDetailsComponent,
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
