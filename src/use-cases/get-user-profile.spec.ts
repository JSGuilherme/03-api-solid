import { InMemoryUsersRepository } from "@/src/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get Profile Use Case', async () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('should be able to get a user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        await expect(user.id).toEqual(expect.any(String));
        await expect(user.name).toEqual('John Doe');
    });

    it('should not be able to get user profile with wrong id', async () => {
        await expect(async () => {
            await sut.execute({
                userId: 'non-existent-user-id' 
            });
        }).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});