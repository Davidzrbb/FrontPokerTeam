import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConnexionUserComponent} from "./app/connexion-user/connexion-user.component";
import {SubscribeUserComponent} from "./app/subscribe-user/subscribe-user.component";
import {PresenceComponent} from "./app/presence/presence.component";
import {AuthGuard} from "./app/auth.guard";
import {AdminComponent} from "./app/admin/admin.component";
import {AuthAdminGuard} from "./app/auth-admin.guard";



const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: ConnexionUserComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthAdminGuard]},
  {path: 'subscribe', component: SubscribeUserComponent},
  {path: 'presence', component: PresenceComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
