import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {TransactionDTO} from "../../models/models";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.css'
})
export class NewTransactionComponent implements OnInit {
  stateOptions!: any[];
  transactionFormGroup!: FormGroup;
  isSaving!: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _http : HttpClient,
    private _messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.stateOptions = [
      { label: 'NORMAL', value: 'NORMAL' },
      { label: 'INSTANTLY', value: 'INSTANTLY' }
    ];
    this.initForm();
  }

  makeTransaction(): void {
    this.transactionFormGroup.disable();
    this.isSaving=true;

    this._http.post(`${environment.transaction_service_host}/transactions/new`, this.transactionFormGroup.value, { responseType: 'text' }).subscribe({
      next: response => {
        this.isSaving=false;
        this.showSuccessMsg(response);
        this.transactionFormGroup.enable();
        this.initForm();
      }, error: () => {
        this.isSaving=false;
        this.transactionFormGroup.enable();
        this.showErrorMsg()
      }
    })
  }

  showSuccessMsg(msg: string) {
    this._messageService.add({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  }

  showErrorMsg() {
    this._messageService.add({ severity: 'danger', summary: 'Danger', detail: 'Transaction failed!', life: 3000 });
  }

  initForm(): void {
    this.transactionFormGroup = this._formBuilder.group({
      ribSender: this._formBuilder.control('', [Validators.required, Validators.minLength(24), Validators.maxLength(24)]),
      ribReceiver: this._formBuilder.control('', [Validators.required, Validators.minLength(24), Validators.maxLength(24)]),
      description: this._formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      amount: this._formBuilder.control('', [Validators.required, Validators.min(100)]),
      transactionType: this._formBuilder.control('NORMAL', Validators.required),
    })
  }

}
