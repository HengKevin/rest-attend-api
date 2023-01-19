import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceRuleController } from './attendance-rule.controller';

describe('AttendanceRuleController', () => {
  let controller: AttendanceRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceRuleController],
    }).compile();

    controller = module.get<AttendanceRuleController>(AttendanceRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
