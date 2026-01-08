import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurFeaturedSectionComponent } from './our-featured-section.component';

describe('OurFeaturedSectionComponent', () => {
  let component: OurFeaturedSectionComponent;
  let fixture: ComponentFixture<OurFeaturedSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurFeaturedSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurFeaturedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
