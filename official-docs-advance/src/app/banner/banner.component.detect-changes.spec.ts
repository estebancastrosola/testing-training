import { ComponentFixtureAutoDetect } from '@angular/core/testing'; //Importamos la libreria que nos permite escuchar los cambios del componente 
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';

describe('BannerComponent (AutoChangeDetect)', () => {
  let comp: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerComponent ], //Ojo con esto! que puede estar en el provider!
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true } //Activamos la libreria para cambios automaticos
      ]
    });
    fixture = TestBed.createComponent(BannerComponent);
    comp = fixture.componentInstance;
    h1 = fixture.nativeElement.querySelector('h1');
  });

  it('should display original title', () => {
    // Hooray! No `fixture.detectChanges()` needed
    expect(h1.textContent).toContain(comp.title);
  });

  it('should still see original title after comp.title change', () => {
    const oldTitle = comp.title;
    comp.title = 'Test Title';
    // Displayed title is old because Angular didn't hear the change :(
    expect(h1.textContent).toContain(oldTitle);
  });

  it('should display updated title after detectChanges', () => {
    comp.title = 'Test Title';
    fixture.detectChanges(); // detect changes explicitly porque Angular testing no se entera de estos cambios. No obstante, podemos llamar a esto las veces que queramos. No hay dano (harm)
    expect(h1.textContent).toContain(comp.title);
  });
});

//The first test shows the benefit of automatic change detection.

//The second and third test reveal an important limitation. The Angular testing environment does not know that the test changed the component's title. The ComponentFixtureAutoDetect service responds to asynchronous activities such as promise resolution, timers, and DOM events. But a direct, synchronous update of the component property is invisible. The test must call fixture.detectChanges() manually to trigger another cycle of change detection.