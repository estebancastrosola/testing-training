import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner-external.component';

describe('BannerComponent (external files)', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let h1: HTMLElement;

  describe('setup that may fail', () => {
    beforeEach(async () => {  //Configuración inicial (puede haber varios beforeEach) 
      await TestBed.configureTestingModule({
        declarations: [ BannerComponent ],
      }); // missing call to compileComponents(). No nos hace falta compilar el css y la template. Pone que puede fallar, porque depende de quien arranque los test. 
      // Esto se completa mas tarde en angular en su seccion correspondiente.
      fixture = TestBed.createComponent(BannerComponent);
    });

    it('should create', () => {
      expect(fixture.componentInstance).toBeDefined();
    });
  });

  describe('Two beforeEach', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ BannerComponent ],
      }).compileComponents();  // compile template and css. Lo necesitamos poner porque vamos a consultar el DOM.  PERO LOS TEST DE ANGULAR SIEMPRE LO COMPILAN ASI Q NO SIRVE PARA NADA.
    });

    // synchronous beforeEach
    beforeEach(() => {
      fixture = TestBed.createComponent(BannerComponent);
      component = fixture.componentInstance;  // BannerComponent test instance
      h1 = fixture.nativeElement.querySelector('h1');
    });

    tests();
  });

  describe('One beforeEach', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ BannerComponent ],
      }).compileComponents();
      fixture = TestBed.createComponent(BannerComponent);
      component = fixture.componentInstance;
      h1 = fixture.nativeElement.querySelector('h1');
    });

    tests();
  });

  function tests() {
    it('no title in the DOM until manually call `detectChanges`', () => {
      expect(h1.textContent).toEqual('');
    });

    it('should display original title', () => {
      fixture.detectChanges();
      expect(h1.textContent).toContain(component.title);
    });

    it('should display a different test title', () => {
      component.title = 'Test Title';
      fixture.detectChanges();
      expect(h1.textContent).toContain('Test Title');
    });
  }
});
