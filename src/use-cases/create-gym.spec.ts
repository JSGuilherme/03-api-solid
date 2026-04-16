import { InMemoryGymsRepository } from "@/src/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', async () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);
    });

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'JavaScript GYM',
            description: null,
            phone: null,
            latitude: -19.9777551,
            longitude: -47.7736227
        });
        
        expect(gym.id).toEqual(expect.any(String));
    });
});