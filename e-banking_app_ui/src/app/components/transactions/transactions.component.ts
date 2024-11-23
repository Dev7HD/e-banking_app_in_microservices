import {Component, OnInit} from '@angular/core';
import {Transaction} from "../../models/models";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit {

  transactions!: Transaction[];
  loading: boolean = false;
  transactionTypes!: any[];
  constructor(
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute
  ) { }
  rib!: string;

  ngOnInit() {
    this.transactionTypes = [
      {label: "Normal", value: "NORMAL"},
      {label: "Instantly", value: "INSTANTLY"},
    ]
    this.loading = true;
    this.rib = this._activatedRoute.snapshot.params['rib'] || undefined;
    if (this.rib){
      this.initAccountTransactions()
    } else {
      this.initAllTransactions()
    }
  }

  initAllTransactions(): void {
    this._http.get<Transaction[]>(`${environment.transaction_service_host}/transactions`).subscribe({
      next: data => {
        this.loading = false;
        this.transactions = data;
      }, error: error => {
        this.loading = false
        console.error("Error fetching transactions data: ", error);
      }
    })
  }

  initAccountTransactions(): void {
    this._http.get<Transaction[]>(`${environment.transaction_service_host}/transactions/rib/${this.rib}`).subscribe({
      next: data => {
        this.loading = false;
        this.transactions = data;
      }, error: error => {
        this.loading = false
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
