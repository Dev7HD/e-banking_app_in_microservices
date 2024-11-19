import {Component, OnInit} from '@angular/core';
import {Transaction} from "../../models/models";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {

  transactions!: Transaction[];
  loading: boolean = false;
  transactionTypes!: any[];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.transactionTypes = [
      {label: "Normal", value: "NORMAL"},
      {label: "Instantly", value: "INSTANTLY"},
    ]
    this.loading = true;
    this._http.get<Transaction[]>(`${environment.transaction_service_host}/transactions`).subscribe({
      next: data => {
        console.warn("fetching transactions....")
        this.loading = false;
        console.table(data);
        this.transactions = data;
      }, error: error => {
        console.error("Error fetching transactions data: ", error);
      }
    })

    this._http.get(`${environment.transaction_service_host}/transactions`).subscribe({
      next: data => {
        console.warn("2- fetching transactions....")
        console.table(data);
      }, error: error => {
        console.error("Error fetching transactions data: ", error);
      }
    })
  }

  getSeverity(clientType: string) {
    switch (clientType) {
      case 'INSTANTLY': return 'success';
      case 'NORMAL': return 'warning';
      default: return 'danger';
    }
  }

}
