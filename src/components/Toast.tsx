import { CheckIcon } from './Icons'

interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {message && (
        <div className="toast" role="status">
          <CheckIcon />
          {message}
        </div>
      )}
    </div>
  )
}
