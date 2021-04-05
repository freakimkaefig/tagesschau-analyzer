import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';

import { HomeStatusComponent } from './home-status.component';

describe('HomeStatusComponent', () => {
  let component: HomeStatusComponent;
  let fixture: ComponentFixture<HomeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeStatusComponent],
      imports: [HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
