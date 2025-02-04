export class CreateUserDto {
  name: string;
  lastname: string;
  documentType: string;
  document: number;
  phone: string;
  user: string;
  email: string;
  password: string;
  rol?: string;
}
