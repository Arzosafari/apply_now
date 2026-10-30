/** Shared error contract for the current demo adapter and a future API adapter. */
export class ApiError extends Error {
  status: number;
  code: string;
  details?: { path: string; message: string }[];

  constructor(message: string, status = 500, code = 'REQUEST_ERROR', details?: { path: string; message: string }[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
