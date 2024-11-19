import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {environment} from "../environments/environment.development";
import {ClientsComponent} from "./components/clients/clients.component";
import {TransactionsComponent} from "./components/transactions/transactions.component";
import {AccountsComponent} from "./components/accounts/accounts.component";
import {SidebarModule} from "primeng/sidebar";
import {RippleModule} from "primeng/ripple";
import {AvatarModule} from "primeng/avatar";
import {StyleClassModule} from "primeng/styleclass";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {TooltipModule} from "primeng/tooltip";
import {SplitButtonModule} from "primeng/splitbutton";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";
import {SelectButtonModule} from "primeng/selectbutton";
import {ToastModule} from "primeng/toast";
import {ReactiveFormsModule} from "@angular/forms";
import {MessageModule} from "primeng/message";
import {MessageService} from "primeng/api";
import {PaginatorModule} from "primeng/paginator";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.kc_url,
        realm: environment.kc_realm,
        clientId: environment.kc_client_id,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    ClientsComponent,
    AccountsComponent,
    NewTransactionComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    KeycloakAngularModule,
    SidebarModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule,
    SplitButtonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TableModule,
    TagModule,
    ProgressSpinnerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectButtonModule,
    ToastModule,
    ReactiveFormsModule,
    MessageModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
