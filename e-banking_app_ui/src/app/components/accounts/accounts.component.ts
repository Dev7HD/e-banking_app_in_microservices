import {AfterContentInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Account, Client} from "../../models/models";
import {environment} from "../../../environments/environment.development";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit, AfterContentInit {

  accounts!: Account[];
  loading: boolean = false;
  clientType!: any[];
  accountTypes!: any[];
  clientId!: number;
  allAccounts: boolean = false;
  addAccountFormGroup!: FormGroup;
  showAddAccountFormDialog: boolean = false;
  isSaving: boolean = false;

  constructor(
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    ) {
  }

  ngAfterContentInit(): void {
    this.initAddAccountForm()

  }

  ngOnInit() {
    this.clientId = this._activatedRoute.snapshot.params['id'] || undefined;
    this.accountTypes = [
      {label: 'Current account', value: "CURRENT_ACCOUNT"},
      {label: 'Saving account', value: "SAVING_ACCOUNT"},
    ]
    this.clientType = [
      {label: "Moral", value: "Moral"},
      {label: "Physical", value: "Physical"}
    ]
    this.loading = true;
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

  initAddAccountForm(){
    if(this.clientId === undefined){
      this.addAccountFormGroup = this._formBuilder.group({
        balance: this._formBuilder.control(0,[Validators.min(1000), Validators.required, Validators.pattern('[0-9]+')]),
        currency: this._formBuilder.control('',[Validators.minLength(3), Validators.required, Validators.pattern('[a-zA-Z]+')]),
        clientId: this._formBuilder.control('',[Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]),
        accountType: this._formBuilder.control('CURRENT_ACCOUNT',[Validators.required, Validators.pattern('[A-Za-z]+[_][A-Za-z]+')]),
      })
    } else {
      this.addAccountFormGroup = this._formBuilder.group({
        balance: this._formBuilder.control(0,[Validators.min(1000), Validators.required, Validators.pattern('[0-9]+')]),
        currency: this._formBuilder.control('',[Validators.minLength(3), Validators.required, Validators.pattern('[a-zA-Z]+')]),
        clientId: this._formBuilder.control({value: this.clientId, disabled: true}),
        accountType: this._formBuilder.control('CURRENT_ACCOUNT',[Validators.required, Validators.pattern('[A-Za-z]+[_][A-Za-z]+')]),
      })

    }
  }

  saveAccount() {
    this.isSaving = true;
    this.addAccountFormGroup.disable()
    let id: number = this.clientId
    let client: Client = {id, ...this.addAccountFormGroup.value}
    this._http.post<Account>(`${environment.account_service_host}/accounts/new`, client).subscribe({
      next: data => {
        this.isSaving = false;
        this.accounts.unshift(data);
        this.initAddAccountForm();
        this.showAddAccountFormDialog = false
        this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: "Account added successfully", life: 3000 })
      }, error: error => {
        this.addAccountFormGroup.enable()
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Saving the new account failed!', life: 3000 });
        console.log("Error saving the new account.", error)
      }
    })
  }

  dismiss() {
    this.showAddAccountFormDialog = false;
  }
}
