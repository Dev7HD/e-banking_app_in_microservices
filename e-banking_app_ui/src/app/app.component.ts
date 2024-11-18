import { Component } from '@angular/core';
import {LoadProfileService} from "./services/load-profile.service";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'e-banking_app_ui';
  items!: MenuItem[];
  constructor(public loadProfileService: LoadProfileService, private router: Router ) {
    this.items = [
      {
        label: 'Logout',
        command: () => {
          this.onLogout();
        }
      },
    ];
  }
  async login(){
    await this.loadProfileService.kcService.login({
      redirectUri : window.location.origin
    })
  }
  onLogout() {
    this.loadProfileService.kcService.logout(window.location.origin);
  }

  account() {
    window.location.href="http://localhost:8080/realms/dev-test-realm/account/#/personal-info";
  }

  home(){
    this.router.navigate(['/']);
  }

  accounts(){
    this.router.navigate(['/accounts']);
  }

  clients(){
    this.router.navigate(['/clients']);
  }

  transactions(){
    this.router.navigate(['/transactions']);
  }

  newTransaction() {
    this.router.navigate(['/new-transaction']);
  }
}
