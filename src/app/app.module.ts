import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import {PageNotFoundComponent} from "./not-found.component";
import {
  ButtonModule, CalendarModule, DataTableModule, DialogModule, InputMaskModule, InputSwitchModule, InputTextModule,
  PasswordModule, DropdownModule, TabMenuModule, ConfirmDialogModule, ConfirmationService, SidebarModule,
  MessagesModule, MessageModule, GrowlModule
} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from "./components/login/login.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {AddUserComponent} from "./components/add-user/add-user.component";
import {FamilyListComponent} from "./components/family-list/family-list.component";
import {FamilyDetailsComponent} from "./components/family-details/family-details.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
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
import {OrderModule, OrderPipe} from "ngx-order-pipe";
import {LineItemService} from "./service/lineItem.service";
import {PriceListService} from "./service/priceList.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {InvoiceService} from "./service/invoice.service";
import {InvoiceDetailsComponent} from './components/invoice-details/invoice-details.component';
import {InvoicesComponent} from './components/invoices/invoices.component';
import {InvoiceNavbarComponent} from './components/invoice-navbar/invoice-navbar.component';
import {DownloadInvoiceComponent} from './components/download-invoice/download-invoice.component';
import {DateRangeValidator} from "./validators/date-range-validator";
import {ContextHelpComponent} from './components/context-help/context-help.component';
import {InactiveFamilyListComponent} from './components/inactive-family-list/inactive-family-list.component';
import {InactiveFamilyDetailsComponent} from './components/inactive-family-details/inactive-family-details.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    NavbarComponent,
    UserListComponent,
    AddUserComponent,
    FamilyListComponent,
    FamilyDetailsComponent,
    UserProfileComponent,
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
    CreateInvoiceDetailsComponent,
    InvoiceDetailsComponent,
    InvoicesComponent,
    InvoiceNavbarComponent,
    DownloadInvoiceComponent,
    DateRangeValidator,
    ContextHelpComponent,
    InactiveFamilyListComponent,
    InactiveFamilyDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    DropdownModule,
    OrderModule,
    TabMenuModule,
    ConfirmDialogModule,
    SidebarModule,
    MessagesModule,
    MessageModule,
    GrowlModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    AuthenticationService,
    FamilyService,
    StudentService,
    GuardianService,
    UserService,
    LineItemService,
    PriceListService,
    InvoiceService,
    ConfirmationService,
    OrderPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
