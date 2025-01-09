import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [], {
      isLoading$: new BehaviorSubject<boolean>(false),
    });

    await TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      providers: [{ provide: LoadingService, useValue: loadingServiceSpy }],
    }).compileComponents();

    loadingService = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not display loading element when isLoading$ is false', () => {
    (loadingService.isLoading$ as BehaviorSubject<boolean>).next(false);
    fixture.detectChanges();

    const loadingElement = fixture.nativeElement.querySelector('div');
    expect(loadingElement).toBeNull();
  });

  it('should display loading element when isLoading$ is true', () => {
    (loadingService.isLoading$ as BehaviorSubject<boolean>).next(true);
    fixture.detectChanges();

    const loadingElement = fixture.nativeElement.querySelector('div');
    expect(loadingElement).toBeTruthy();

    const imgElement = loadingElement.querySelector('img');
    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toContain('assets/images/loading.gif');
    expect(imgElement.alt).toBe('Loading...');
  });
});
