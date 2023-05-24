import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeService } from '../services/welcome.service';

import { Welcome2Component } from './welcome2.component';

class MockWelcomeService {
  isLoggedIn = true;
  user = { name: 'Nombre Fake'};
}

describe('Welcome2Component', () => {
  let component: Welcome2Component;
  let welcomeService: WelcomeService;
  let fixture: ComponentFixture<Welcome2Component>;

  beforeEach(async () => { //El beforeEach
    await TestBed.configureTestingModule({
      declarations: [  ],// Si creamos el componente con TestBed con el inject, y no con el fixture, necesitamos meterlo en los providers.
      //declarations: [  ],
      providers: [Welcome2Component, { provide: WelcomeService, useClass: MockWelcomeService } ] //Con el UseClass podemos usar otra clase ne vez de la original
    })
    .compileComponents(); //El compile components compila el template y el css. Es asincrono y necesita un async/await. Tambien lo podremos ver con un WaitForAsync en el TestBed

    fixture = TestBed.createComponent(Welcome2Component); //Crea una instancia del componente, crea el correspondiente elemento para el Test RunnerDOM, y devuelve un ComponentFixture, Esto se hace siempre despues de configurar el TestBed. El componentFixture, sirve para poder interactuar con el componente creado (YO CREO al 99 que si lo creas con el TestBed Inject no se podra acceder a determinadas cosas del DOM creo)
    component = fixture.componentInstance;// si creamos el componente a traves del a fixture, creamos el componente con sus dependencias NO con la configuracion de TestBed, y con los ciclos de vida del componente
    //component = TestBed.inject(Welcome2Component); //Si creamos el componente con la configuracion de TestBed, lo creamos con los providers indicados. Hay que ir ejecutando sus ciclos de vida, como lo haria angular cuando crea el componente. A esto se le llama, class-only test ( NO se puede acceder al DOM ni manupularlo)
    welcomeService = TestBed.inject(WelcomeService); //Hay otra forma e cargar servicios a traes del fixture. MIRAR DOC DE ANGULAR .
    //PEro ya te adelante que la forma mas segura y que siempre funciona es cargar el servicio a traves del componente con el fixture
    fixture.detectChanges();

    //TODO este setup se puede meter en los iT, tanto el configureTesting como la creacion de todos los componentes


    //Cosas importantes que he visto en la doc pero no estan como ejemplo
    /**
     * Se puede acceder al HTML Element const bannerElement: HTMLElement = fixture.nativeElement;
     *
     * Pero hay una mejor manera con mejor compatibildad con mas abstraccion
     *
     * const bannerDe: DebugElement = fixture.debugElement;
       const bannerEl: HTMLElement = bannerDe.nativeElement;
     *

       Para acceder a cosas del DOM, se pueden hacer query selector o By.css() por lo visto con el By.css se tiene mejor compatibilidad o algunas cosa asi
     */
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should not have welcome message after construction', () => {
    expect(component.welcome).toBe('');
  });

  it('should welcome logged in user after Angular calls ngOnInit', () => {
    component.ngOnInit(); //Hay que ejecutar el on init manualmente SOLO SI USAMOS EL METODO TESTBED.inject()
    expect(component.welcome).toContain('Nombre Fake');
  });

});
