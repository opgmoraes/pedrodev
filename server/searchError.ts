export class SearchError extends Error {
  constructor(public status: number, message: string, public details?: Record<string, string | number | boolean>) { super(message); }
}
