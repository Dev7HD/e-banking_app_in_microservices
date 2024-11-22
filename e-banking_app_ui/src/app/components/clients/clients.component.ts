import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Client, ClientDTO} from "../../models/models";
import {environment} from "../../../environments/environment.development";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  clients: any[] = [];
  accountId!: string;
  isSaving: boolean = false;
  loading: boolean = false;
  clientType!: any[];
  newClientVisibleDialog!: boolean;
  newClientFormGroup!: FormGroup;
  actions!: MenuItem[];
  clonedClients: { [s: string]: Client } = {};

  constructor(
    private _http: HttpClient,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.initNewClientForm();
    this.newClientVisibleDialog = false;
    this.clientType = [
      {label: "Moral", value: "Moral"},
      {label: "Physical", value: "Physical"}
    ]
    this.loading = true;
    this._http.get<Client[]>(`${environment.client_service_host}/clients`).subscribe({
      next: data => {
        this.loading = false;
        this.clients = data;
      }, error: error => {
        console.error("Error fetching clients data: ", error);
      }
    })
  }

  initNewClientForm(): void {
    this.newClientFormGroup = this._formBuilder.group({
      firstName: this._formBuilder.control("", [Validators.required, Validators.minLength(3)]),
      lastName: this._formBuilder.control("", [Validators.required, Validators.minLength(3)]),
      clientType: this._formBuilder.control("Physical", [Validators.required]),
    })
  }

  getClientSeverity(clientType: string) {
    switch (clientType) {
      case 'Physical': return 'success';
      case 'Moral': return 'warning';
      default: return 'danger';
    }
  }

  dismiss(){
    this.initNewClientForm()
    this.newClientVisibleDialog = false;
  }

  saveClient(){
    this.newClientFormGroup.disable();
    this.isSaving = true;
    this._http.post<Client>(`${environment.client_service_host}/clients/new`, this.newClientFormGroup.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.newClientVisibleDialog = false;
        this.initNewClientForm()
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Client saved successfully.', life: 3000 });
      }, error: err => {
        this.newClientFormGroup.enable();
        this._messageService.add({ severity: 'danger', summary: 'Danger', detail: 'Saving client failed!', life: 3000 });
        console.error("Saving client failed: ", err.message);
      }
    })
  }

  onRowEditInit(client: Client) {
    this.clonedClients[client.id as number] = { ...client };
  }

  onRowEditSave(id: number, client: ClientDTO, index: number) {
    this._http.put<Client>(`${environment.client_service_host}/clients/${id}/update`, client).subscribe({
      next: data => {
        this.clients[index] = data;
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Client updated successfully.',
          life: 3000
        });
      }, error: err => {
        console.log("Updating client failed!",err)
        this._messageService.add({
          severity: 'danger',
          summary: 'Updating client failed!',
          detail: 'Updating client failed!',
        })
        this.onUpdatingFailed(id, client, index);
      }
    })
  }

  onUpdatingFailed(id: number, clientDto: ClientDTO, rowIndex: number){
    let client: Client = {id, ...clientDto};
    this.onRowEditCancel(client, rowIndex);
  }

  onRowEditCancel(client: Client, index: number) {
    this.clients[index] = this.clonedClients[client.id as number];
    delete this.clonedClients[client.id as number];
  }

}
