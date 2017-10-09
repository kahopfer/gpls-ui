import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseRequestOptions, HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {PageNotFoundComponent} from "./not-found.component";
import {
  ButtonModule, CalendarModule, DataTableModule, DialogModule, InputMaskModule, InputSwitchModule, InputTextModule,
  PasswordModule
} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from './login/login.component';
import {AuthGuard} from "./guards/auth.guard";
import {AuthenticationService} from "./service/authentication.service";
import {NavbarComponent} from './navbar/navbar.component';
import {ErrorAlertComponent} from './error-alert/error-alert.component';
import {AdminGuard} from "./guards/admin.guard";
import {UserService} from "./service/user.service";
import {UserListComponent} from './user/user-list/user-list.component';
import {AddUserComponent} from './user/add-user/add-user.component';
import {FamilyListComponent} from './family-list/family-list.component';
import {FamilyDetailsComponent} from './family-details/family-details.component';
import {FamilyService} from "./service/family.service";
import {StudentService} from "./service/student.service";
import {GuardianService} from "./service/guardian.service";
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { SuccessAlertComponent } from './success-alert/success-alert.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { EnrollFamilyComponent } from './enroll-family/enroll-family.component';
import {TextMaskModule} from "angular2-text-mask";
import { CheckInComponent } from './check-in/check-in.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { CheckInDetailsComponent } from './check-in-details/check-in-details.component';
import { CheckOutDetailsComponent } from './check-out-details/check-out-details.component';
import { ManageRatesComponent } from './manage-rates/manage-rates.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    NavbarComponent,
    ErrorAlertComponent,
    UserListComponent,
    AddUserComponent,
    FamilyListComponent,
    FamilyDetailsComponent,
    UserProfileComponent,
    SuccessAlertComponent,
    BackButtonComponent,
    EnrollFamilyComponent,
    CheckInComponent,
    CheckOutComponent,
    CheckInDetailsComponent,
    CheckOutDetailsComponent,
    ManageRatesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    DataTableModule,
    InputTextModule,
    PasswordModule,
    InputSwitchModule,
    ButtonModule,
    CalendarModule,
    TextMaskModule,
    DialogModule,
    InputMaskModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    AuthenticationService,
    BaseRequestOptions,
    FamilyService,
    StudentService,
    GuardianService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
