import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";


let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch nearby gyms use case', async () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -19.9777551,
            longitude: -47.7736227
        });

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -19.801517,
            longitude: -47.906125
        });

        const { gyms } = await sut.execute({
            userLatitude: -19.9777551,
            userLongitude: -47.7736227
        });

        await expect(gyms).toHaveLength(1);
        await expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ]);
    });
});