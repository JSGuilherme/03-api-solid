export class LateCheckInValidationError extends Error {
    constructor(msg?: string) {
        super(msg || 'The check-in can only be validated within 20 minutes of its creation.');
    }
}