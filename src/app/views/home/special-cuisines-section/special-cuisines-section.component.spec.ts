import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCuisinesSectionComponent } from './special-cuisines-section.component';

describe('SpecialCuisinesSectionComponent', () => {
  let component: SpecialCuisinesSectionComponent;
  let fixture: ComponentFixture<SpecialCuisinesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCuisinesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialCuisinesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
