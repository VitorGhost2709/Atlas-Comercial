export type AppError = {
  message: string
  cause?: unknown
}

export function toAppError(cause: unknown, fallbackMessage = 'Erro inesperado'): AppError {
  if (cause instanceof Error) return { message: cause.message, cause }
  return { message: fallbackMessage, cause }
}

