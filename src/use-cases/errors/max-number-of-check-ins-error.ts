export class MaxNumberOfCheckInsError extends Error {
    constructor(msg?: string) {
        super(msg || 'Maximum number of check-ins reached.');
    }
}