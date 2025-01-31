export class CreateUserDto {
  name: string;
  lastname: string;
  documentType: string;
  document: number;
  user: string;
  email: string;
  password: string;
  rol?: string;
}
