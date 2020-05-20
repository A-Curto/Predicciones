import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InicioComponent} from "./inicio/inicio.component";
import {PrediccionesCo2Component} from "./predicciones-co2/predicciones-co2.component";
import {CrearPrediccionComponent} from "./crear-prediccion/crear-prediccion.component";


const routes: Routes = [
  {path: 'inicio',component: InicioComponent},
  {path: 'predicciones-co2',component: PrediccionesCo2Component},
  {path: 'crear-prediccion',component: CrearPrediccionComponent},
  {path: '',redirectTo:'/inicio',pathMatch: 'full'},
  {path: '**',redirectTo:'/inicio',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
