import { Injectable } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";

@Injectable({
  providedIn: 'root'
})
export class LoadProfileService {

  public profile!: KeycloakProfile;

  constructor(public kcService: KeycloakService) {
    this.init();
  }

  init(): void {
    this.kcService.loadUserProfile()
      .then(profile => {
        this.profile = profile;
      })
  }
}
