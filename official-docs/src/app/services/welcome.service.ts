import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  isLoggedIn = false;
  user = { name: 'Nombre Del Servicio'};
  
}
