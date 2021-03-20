import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagesschauLogoComponent } from './tagesschau-logo.component';

describe('TagesschauLogoComponent', () => {
  let component: TagesschauLogoComponent;
  let fixture: ComponentFixture<TagesschauLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagesschauLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagesschauLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
