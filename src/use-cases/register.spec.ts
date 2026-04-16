import { InMemoryUsersRepository } from "@/src/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-alredy-exists.error";
import { RegisterUseCase } from "./register";
let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase    ;

describe('Register Use Case', async () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    });
    it('should hash user password upon registration', async () => {
        
        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456'
        });
        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        );
        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it('should not be able to register with same email twice', async () => {
        const email = 'john.doe@example.com';
        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456'
        });

        await expect(() => sut.execute({
            name: 'John Doe2',
            email,
            password: '123456789'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

    it('should be able to register', async () => {
        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456'
        });
        
        expect(user.id).toEqual(expect.any(String));
    });
});