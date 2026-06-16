import { GoogleConfig } from 'src/auth-google/config/google-config.type';
import { AuthConfig } from 'src/auth/config/auth-config.type';

export type AllConfigType = {
  auth: AuthConfig;
  google: GoogleConfig;
};
