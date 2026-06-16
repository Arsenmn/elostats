import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { AnalyzePlayerDto } from './dto/analyze-player.dto';
import { ComparePlayersDto } from './dto/compare-players.dto';

@Controller('ai-analysis')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Post('player')
  analyzePlayer(@Body() dto: AnalyzePlayerDto) {
    return this.aiAnalysisService.analyzePlayer(dto);
  }

  @Post('compare')
  comparePlayers(@Body() dto: ComparePlayersDto) {
    return this.aiAnalysisService.comparePlayers(dto);
  }
}
