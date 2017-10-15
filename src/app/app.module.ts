import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseRequestOptions, HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {PageNotFoundComponent} from "./not-found.component";
import {
  ButtonModule, CalendarModule, DataTableModule, DialogModule, InputMaskModule, InputSwitchModule, InputTextModule,
  PasswordModule, DropdownModule
} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from "./components/login/login.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {ErrorAlertComponent} from "./components/error-alert/error-alert.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {AddUserComponent} from "./components/add-user/add-user.component";
import {FamilyListComponent} from "./components/family-list/family-list.component";
import {FamilyDetailsComponent} from "./components/family-details/family-details.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {SuccessAlertComponent} from "./components/success-alert/success-alert.component";
import {BackButtonComponent} from "./components/back-button/back-button.component";
import {EnrollFamilyComponent} from "./components/enroll-family/enroll-family.component";
import {CheckInComponent} from "./components/check-in/check-in.component";
import {CheckOutComponent} from "./components/check-out/check-out.component";
import {CheckInDetailsComponent} from "./components/check-in-details/check-in-details.component";
import {CheckOutDetailsComponent} from "./components/check-out-details/check-out-details.component";
import {ManageRatesComponent} from "./components/manage-rates/manage-rates.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {InvoiceListComponent} from "./components/invoice-list/invoice-list.component";
import {TextMaskModule} from "angular2-text-mask";
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";
import {AuthenticationService} from "./service/authentication.service";
import {FamilyService} from "./service/family.service";
import {StudentService} from "./service/student.service";
import {GuardianService} from "./service/guardian.service";
import {UserService} from "./service/user.service";
import {CreateInvoiceDetailsComponent} from "./components/create-invoice-details/create-invoice-details.component";
import {CreateInvoiceComponent} from "./components/create-invoice/create-invoice.component";

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
    ManageRatesComponent,
    ResetPasswordComponent,
    InvoiceListComponent,
    CreateInvoiceComponent,
    CreateInvoiceDetailsComponent
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
    InputMaskModule,
    DropdownModule
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
