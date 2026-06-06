// ═══════════════════════════════════════════════════
// core/errors.ts — AppError hierarchy NOTARA
// ═══════════════════════════════════════════════════

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

export class SyncError extends AppError {
  constructor(message: string) {
    super(message, 'SYNC_ERROR')
    this.name = 'SyncError'
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

export class StockError extends AppError {
  constructor(message: string) {
    super(message, 'STOCK_ERROR')
    this.name = 'StockError'
  }
}
