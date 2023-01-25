import { Test, TestingModule } from '@nestjs/testing';
import { HistoricAttendanceService } from './historic-attendance.service';

describe('HistoricAttendanceService', () => {
  let service: HistoricAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricAttendanceService],
    }).compile();

    service = module.get<HistoricAttendanceService>(HistoricAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
