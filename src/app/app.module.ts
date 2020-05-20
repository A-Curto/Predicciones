import {BrowserModule, Title} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { PrediccionesCo2Component } from './predicciones-co2/predicciones-co2.component';
import { CrearPrediccionComponent } from './crear-prediccion/crear-prediccion.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    PrediccionesCo2Component,
    CrearPrediccionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
