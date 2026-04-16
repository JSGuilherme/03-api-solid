export class ResourceNotFoundError extends Error {
    constructor(msg?: string) {
        super(msg || 'Resource not found.');
    }
}