import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Client} from "../../models/models";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  clients!: Client[];
  loading: boolean = false;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.loading = true;
    this._http.get<Client[]>(`${environment.client_service_host}/clients`).subscribe({
      next: data => {
        this.loading = false;
        console.table(data);
        this.clients = data;
      }, error: error => {
        console.error("Error fetching clients data: ", error);
      }
    })
  }

  getClientSeverity(clientType: string) {
    switch (clientType) {
      case 'Physical': return 'success';
      case 'Moral': return 'warning';
      default: return 'danger';
    }
  }
}
