import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { CreateUserOptions, DoesUserExist } from '../types';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class AuthValidator {
  constructor(private readonly authRepository: AuthRepository) {}

  async validateOnCreate(options: CreateUserOptions): Promise<void> {
    const doesUserExist = await this.doesUserExist({
      email: options.email,
    });
    if (doesUserExist) {
      throw new ConflictException('User already exists');
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const minLengthRegex = /.{8,}/; 
  const lowercaseRegex = /[a-z]/; 
  const uppercaseRegex = /[A-Z]/; 
  const digitRegex = /\d/; 
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    minLengthRegex.test(password) &&
    lowercaseRegex.test(password) &&
    uppercaseRegex.test(password) &&
    digitRegex.test(password) &&
    specialCharRegex.test(password)
  )
  }

  async doesUserExist({ email }: DoesUserExist): Promise<boolean> {
    return await this.authRepository.exist({
      where: { email },
    });
  }
}
