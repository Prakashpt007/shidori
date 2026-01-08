import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollerBarListComponent } from './scroller-bar-list.component';

describe('ScrollerBarListComponent', () => {
  let component: ScrollerBarListComponent;
  let fixture: ComponentFixture<ScrollerBarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollerBarListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrollerBarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
