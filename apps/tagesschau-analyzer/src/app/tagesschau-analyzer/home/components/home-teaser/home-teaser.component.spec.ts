import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../../shared/shared.module';

import { HomeTeaserComponent } from './home-teaser.component';

describe('HomeTeaserComponent', () => {
  let component: HomeTeaserComponent;
  let fixture: ComponentFixture<HomeTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTeaserComponent],
      imports: [SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
