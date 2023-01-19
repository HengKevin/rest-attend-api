import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceRuleService } from './attendance-rule.service';

describe('AttendanceRuleService', () => {
  let service: AttendanceRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceRuleService],
    }).compile();

    service = module.get<AttendanceRuleService>(AttendanceRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
