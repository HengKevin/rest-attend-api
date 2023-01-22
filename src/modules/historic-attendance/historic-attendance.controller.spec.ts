import { Test, TestingModule } from '@nestjs/testing';
import { HistoricAttendanceController } from './historic-attendance.controller';

describe('HistoricAttendanceController', () => {
  let controller: HistoricAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricAttendanceController],
    }).compile();

    controller = module.get<HistoricAttendanceController>(
      HistoricAttendanceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
