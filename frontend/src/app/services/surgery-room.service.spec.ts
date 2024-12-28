import { TestBed } from '@angular/core/testing';

import { SurgeryRoomService } from './surgery-room.service';

describe('SurgeryRoomService', () => {
  let service: SurgeryRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurgeryRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
