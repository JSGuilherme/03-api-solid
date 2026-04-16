import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";


let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search gyms use case', async () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -19.9777551,
            longitude: -47.7736227
        });

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -19.9777551,
            longitude: -47.7736227
        });

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 1,
        });

        await expect(gyms).toHaveLength(1);
        await expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ]);
    });

    it('should be able to fetch paginated gyms', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `gym-${i}`,
                description: null,
                phone: null,
                latitude: -19.9777551,
                longitude: -47.7736227
            });
        }
        const { gyms } = await sut.execute({
            query: 'gym',
            page: 2,
        });

        await expect(gyms).toHaveLength(2);
        await expect(gyms).toEqual([
            expect.objectContaining({ title: 'gym-21' }),
            expect.objectContaining({ title: 'gym-22' }),
        ]);
    });
});