import { PrismaUsersRepository } from '@/src/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '@/src/use-cases/authenticate';

export function makeAuthenticateUserCase() {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);
    return authenticateUseCase;
}

