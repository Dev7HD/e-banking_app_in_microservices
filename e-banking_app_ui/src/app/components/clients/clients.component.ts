import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Client, ClientDTO} from "../../models/models";
import {environment} from "../../../environments/environment.development";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  clients: any[] = [];
  isDeleting: boolean = false;
  isSaving: boolean = false;
  loading: boolean = false;
  clientType!: any[];
  newClientVisibleDialog!: boolean;
  newClientFormGroup!: FormGroup;
  clonedClients: { [s: string]: Client } = {};
  isDeletingClient: boolean = false;

  constructor(
    private _http: HttpClient,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _router: Router,
    private confirmationService: ConfirmationService,
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

  confirm(id: number, ri: number) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed deleting this client. id: ' + id,
      accept: () => {
        this.isDeleting = true;
        this.deleteClient(id, ri);
      },
      reject: () => {
        console.log("Confirmation declined.")
      }
    });
  }

  deleteClient(id: number, ri: number){
    this._messageService.add({ severity: 'warn', summary: 'Deleting', detail: "Deleting client with..." });
    this._http.delete(`${environment.client_service_host}/clients/${id}/delete`, { responseType: 'text' }).subscribe({
      next: msg => {
        this._messageService.clear()
        this.isDeleting = false;
        this._messageService.add({ severity: 'info', summary: 'Confirmed', detail: msg, life: 3000 });
        this.clients.splice(ri, 1)
      }, error: error => {
        this.isDeleting = false;
        console.error("Error deleting client : ", error);
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Deleting client failed!', life: 3000 });
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
      next: data => {
        this.isSaving = false;
        this.newClientVisibleDialog = false;
        this.initNewClientForm()
        this.clients.unshift(data);
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

  viewClientAccounts(id: number) {
    this._router.navigateByUrl(`/accounts/client/${id}`)
  }
}
