import { Module } from '@nestjs/common';
import { FaceitModule } from '../faceit/faceit.module';
import { AiAnalysisController } from './ai-analysis.controller';
import { AiAnalysisService } from './ai-analysis.service';

@Module({
  imports: [FaceitModule],
  controllers: [AiAnalysisController],
  providers: [AiAnalysisService],
})
export class AiAnalysisModule {}
