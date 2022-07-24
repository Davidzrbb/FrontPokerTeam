import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConnexionComponent} from "./app/connexion/connexion.component";
import {InscriptionComponent} from "./app/inscription/inscription.component";
//import {HomeComponent} from './components/home/home.component';


const routes: Routes = [
  {path: 'connexion', component: ConnexionComponent},
  {path: '', redirectTo: 'connexion', pathMatch: 'full'},
  {path: 'subscribe', component: InscriptionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
