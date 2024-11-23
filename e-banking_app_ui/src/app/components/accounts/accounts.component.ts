import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Account} from "../../models/models";
import {environment} from "../../../environments/environment.development";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {

  accounts!: Account[];
  loading: boolean = false;
  clientType!: any[];
  accountTypes!: any[];
  clientId!: number;
  allAccounts: boolean = false;

  constructor(
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    ) {
  }

  ngOnInit() {
    this.accountTypes = [
      {label: 'Current account', value: "CURRENT_ACCOUNT"},
      {label: 'Saving account', value: "SAVING_ACCOUNT"},
    ]
    this.clientType = [
      {label: "Moral", value: "Moral"},
      {label: "Physical", value: "Physical"}
    ]
    this.loading = true;
    this.clientId = this._activatedRoute.snapshot.params['id'] || undefined;
    if (this.clientId){
      this.initClientAccounts()
    } else {
      this.initAllAccounts()
    }
  }

  initClientAccounts(){
    this.allAccounts = false;
    this._http.get<Account[]>(`${environment.account_service_host}/accounts/client/${this.clientId}`).subscribe({
      next: data => {
        this.accounts = data;
        this.loading = false
      }, error: error => {
        this.loading = false
        console.log("Error fetching accounts data: ", error);
      }
    })
  }

  initAllAccounts(){
    this.allAccounts = true;
    this._http.get<Account[]>(`${environment.account_service_host}/accounts`).subscribe({
      next: data => {
        this.loading = false;
        this.accounts = data;
      }, error: error => {
        this.loading = false
        console.log("Error fetching accounts data: ", error);
      }
    })
  }

  getSeverity(type: string) {
    switch (type) {
      case 'SAVING_ACCOUNT':
        return 'success';
      case 'CURRENT_ACCOUNT':
        return 'warning';
      default: return 'danger';
    }
  }

  getClientSeverity(clientType: string) {
    switch (clientType) {
      case 'Physical': return 'success';
      case 'Moral': return 'warning';
      default: return 'danger';
    }
  }

  viewTransactions(rib: string) {
    this._router.navigateByUrl(`/transactions/account/${rib}`);
  }
}
