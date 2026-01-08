import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalCuisinesSectionComponent } from './regional-cuisines-section.component';

describe('RegionalCuisinesSectionComponent', () => {
  let component: RegionalCuisinesSectionComponent;
  let fixture: ComponentFixture<RegionalCuisinesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionalCuisinesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionalCuisinesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
