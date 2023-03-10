import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LightSwitchComponent } from './light-switch/light-switch.component';
import { DashboardHeroComponent } from './dashboard-hero/dashboard-hero.component';
import { WellcomeComponentComponent } from './wellcome-component/wellcome-component.component';
import { WelcomeComponent } from './welcome/welcome2.component';

@NgModule({
  declarations: [
    AppComponent,
    LightSwitchComponent,
    DashboardHeroComponent,
    WellcomeComponentComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
