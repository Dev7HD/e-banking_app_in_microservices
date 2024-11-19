import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Account} from "../../models/models";
import {environment} from "../../../environments/environment.development";

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

  constructor(private _http: HttpClient) {
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
    this._http.get<Account[]>(`${environment.account_service_host}/accounts`).subscribe({
      next: data => {
        this.loading = false;
        console.table(data);
        this.accounts = data;
      }, error: error => {
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

}
