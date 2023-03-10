import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';

describe('BannerComponent (inline template)', () => { //al ser inline no necesita el compileComponents ni esperarse? 
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let h1: HTMLElement;

  beforeEach(() => {// 1 Before each.
    TestBed.configureTestingModule({
      declarations: [ BannerComponent ],
    });
    fixture = TestBed.createComponent(BannerComponent); //El createComponent NO bindea DATOS
    component = fixture.componentInstance; // BannerComponent test instance. Lo creamos a traves de la fixture para compilar la template y los estilos y poder consultar al DOM
    h1 = fixture.nativeElement.querySelector('h1');
  });

  it('no title in the DOM after createComponent()', () => {
    expect(h1.textContent).toEqual(''); 
  });

  it('should display original title', () => { //Muy importante siempre usar el detectChanges para cambios reactivos de variables del DOM. 
    fixture.detectChanges(); //Binding Happens when Angular performs change detections!!!
    expect(h1.textContent).toContain(component.title);
  });

  it('should display original title after detectChanges()', () => {
    fixture.detectChanges(); //Binding Happens when Angular performs change detections!!!
    expect(h1.textContent).toContain(component.title);
  });

  it('should display a different test title', () => {
    component.title = 'Test Title';
    fixture.detectChanges(); //Binding Happens when Angular performs change detections!!!
    expect(h1.textContent).toContain('Test Title');
  });
});

//NOTA: Se pueden automatizar la deteccion de cambios con Jasmine y no tener que estar todo el rato preguntando, ir a banner detect changes .spec.ts

