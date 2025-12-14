import { Role } from 'generated/prisma/enums';

export class JwtPayloadDTO {
  sub: string;
  email: string;
  role: Role;
}
