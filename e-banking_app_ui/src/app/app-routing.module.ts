import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientsComponent} from "./components/clients/clients.component";
import {AccountsComponent} from "./components/accounts/accounts.component";
import {TransactionsComponent} from "./components/transactions/transactions.component";
import {AuthGuard} from "./guards/auth.guard";
import {NewTransactionComponent} from "./components/new-transaction/new-transaction.component";
import {TestComponent} from "./tests/test/test.component";

const routes: Routes = [
  {path: 'clients', component: ClientsComponent, canActivate: [AuthGuard]},
  {path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard]},
  {path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
  {path: 'new-transaction', component: NewTransactionComponent, canActivate: [AuthGuard]},
  {path: 'test', component: TestComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
