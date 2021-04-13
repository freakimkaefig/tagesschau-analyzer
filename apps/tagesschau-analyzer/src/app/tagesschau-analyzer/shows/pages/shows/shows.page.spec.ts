import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../../shared/shared.module';

import { ShowsPage } from './shows.page';

describe('ShowsPage', () => {
  let component: ShowsPage;
  let fixture: ComponentFixture<ShowsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowsPage],
      imports: [SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
