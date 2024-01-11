import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameonlinePage } from './gameonline.page';

describe('GameonlinePage', () => {
  let component: GameonlinePage;
  let fixture: ComponentFixture<GameonlinePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GameonlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
