export class MaxDistanceError extends Error {
    constructor(msg?: string) {
        super(msg || 'Maximum distance reached.');
    }
}