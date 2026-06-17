import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoFormulario } from './consumo-formulario';

describe('ConsumoFormulario', () => {
  let component: ConsumoFormulario;
  let fixture: ComponentFixture<ConsumoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoFormulario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
