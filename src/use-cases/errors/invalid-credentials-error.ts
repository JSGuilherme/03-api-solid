export class InvalidCredentialsError extends Error {
    constructor(msg?: string) {
        super(msg || 'Invalid credentials.');
    }
}