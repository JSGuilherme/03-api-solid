import { CheckIn } from "@/generated/prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs = require("dayjs");
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInUseCaseRequest {
    checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn;
}


export class ValidateCheckInUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {

    }

    async execute({
        checkInId
    }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId);

        if(!checkIn){
            throw new ResourceNotFoundError();
        }

        let timeDifferenceFromCheckInCreationInMinutes = dayjs(new Date()).diff(checkIn.created_at, 'minutes',);
        if(timeDifferenceFromCheckInCreationInMinutes > 20){
            throw new LateCheckInValidationError();
        }

        checkIn.validated_at = new Date();

        await this.checkInsRepository.save(checkIn);

        return { checkIn };
    }
}