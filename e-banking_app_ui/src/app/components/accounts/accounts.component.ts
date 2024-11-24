import {AfterContentInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Account, Client, TransactionType} from "../../models/models";
import {environment} from "../../../environments/environment.development";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";

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
  addAccountFormGroup!: FormGroup;
  newTransactionFormGroup!: FormGroup;
  showAddAccountFormDialog: boolean = false;
  isSaving: boolean = false;
  showNewTransactionFormDialog: boolean = false;
  ri!: number;
  transactionTypes!: any[];

  constructor(
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    ) {
  }

  /*ngAfterContentInit(): void {
    this.initAddAccountForm()
    this.initFormTransactionForm()

  }*/

  ngOnInit() {
    this.clientId = this._activatedRoute.snapshot.params['id'] || undefined;
    this.initAddAccountForm()
    this.initFormTransactionForm()
    this.transactionTypes = [
      {label: "Normal", value: "NORMAL"},
      {label: "Instantly", value: "INSTANTLY"},
    ]
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
    this.showPendingMsg('Adding the new account....');
    this.isSaving = true;
    this.addAccountFormGroup.disable()
    let id: number = this.clientId
    let account: Account = {id, ...this.addAccountFormGroup.value}
    console.table(account)
    this._http.post<Account>(`${environment.account_service_host}/accounts/new`, account).subscribe({
      next: data => {
        this.isSaving = false;
        this._messageService.clear()
        this.accounts.unshift(data);
        this.initAddAccountForm();
        this.showAddAccountFormDialog = false
        this.showSuccessMsg("Account added successfully");
      }, error: error => {
        this.addAccountFormGroup.enable()
        this.showErrorMsg('Saving the new account failed!')
        console.log("Error saving the new account.", error)
      }
    })
  }

  showSuccessMsg(msg: string) {
    this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: msg, life: 3000 })
  }

  showErrorMsg(msg: string){
    this._messageService.add({ severity: 'error', summary: 'Rejected', detail: msg, life: 3000 });
  }

  dismiss() {
    this.showAddAccountFormDialog = false;
    this.showNewTransactionFormDialog = false;
  }

  showPendingMsg(msg: string) {
    this._messageService.add({severity: 'warn', summary: 'Sending...', detail: msg, life: 10000})
  }

  newTransaction(rib: any, ri: number) {
    this.newTransactionFormGroup.get('ribSender')?.setValue(rib)
    console.table(this.newTransactionFormGroup.value)
    this.ri = ri;
    this.showNewTransactionFormDialog = true;
  }

  saveNewTransaction(): void {
    this.showPendingMsg('Saving the new transaction....');
    this.newTransactionFormGroup.disable();
    this.isSaving=true;
    this._http.post(`${environment.transaction_service_host}/transactions/new`, this.newTransactionFormGroup.value, { responseType: 'text' }).subscribe({
      next: response => {
        this.enableForm()
        this.accounts[this.ri].balance -= this.newTransactionFormGroup.get('amount')?.value as number
        this.showNewTransactionFormDialog = false
        this.showSuccessMsg(response);
        this.initFormTransactionForm();
      }, error: () => {
        this.enableForm()
        this.showErrorMsg('Posting new transaction failed!')
      }
    })
  }
  enableForm(){
    this._messageService.clear()
    this.isSaving=false;
    this.newTransactionFormGroup.enable();
  }

  initFormTransactionForm() {
    this.newTransactionFormGroup = this._formBuilder.group({
      ribSender: this._formBuilder.control({value:'', disabled: true}, [Validators.min(100), Validators.required, Validators.pattern('[0-9]+')]),
      ribReceiver: this._formBuilder.control('', [Validators.min(100), Validators.required, Validators.pattern('[0-9]{24}')]),
      amount: this._formBuilder.control(0, [Validators.min(100), Validators.required, Validators.pattern('[0-9]+')]),
      description: this._formBuilder.control('', [Validators.minLength(3), Validators.required, Validators.pattern('[a-zA-Z]+')]),
      transactionType: this._formBuilder.control('NORMAL', [Validators.required, Validators.pattern('[A-Z]+')])
    })
  }



}
