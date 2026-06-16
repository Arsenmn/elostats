import { IsString, Length } from 'class-validator';

export class ConfirmAuthCodeDto {
  @IsString()
  verificationId: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
