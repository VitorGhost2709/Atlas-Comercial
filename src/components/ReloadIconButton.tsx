import { RotateCcw } from 'lucide-react'

type Props = {
  onClick: () => void
  disabled?: boolean
  className?: string
}

const baseClass =
  'inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-1.5 text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40'

/** Botão de recarregar lista (ícone Lucide `rotate-ccw`), usado nos cabeçalhos das telas. */
export function ReloadIconButton({ onClick, disabled, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Recarregar"
      title="Recarregar"
      className={className ? `${baseClass} ${className}` : baseClass}
    >
      <RotateCcw className="h-6 w-6" strokeWidth={2} aria-hidden />
    </button>
  )
}
