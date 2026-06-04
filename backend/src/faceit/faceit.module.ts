import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FaceitService } from './faceit.service';
import { FaceitController } from './faceit.controller';

@Module({
  imports: [HttpModule],
  controllers: [FaceitController],
  providers: [FaceitService],
})
export class FaceitModule {}
