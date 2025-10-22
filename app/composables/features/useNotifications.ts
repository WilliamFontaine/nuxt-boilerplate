interface ToastOptions {
  title: string
  message: string
  duration?: number
  actions?: Array<{
    label: string
    click: () => void
  }>
}

export const useNotifications = () => {
  const toast = useToast()

  const success = ({ title, message, duration = 5000, actions }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-check-circle',
      color: 'success',
      duration,
      actions
    })
  }

  const error = ({ title, message, duration = 8000, actions }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-x-circle',
      color: 'error',
      duration,
      actions
    })
  }

  const info = ({ title, message, duration = 5000, actions }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-info',
      color: 'info',
      duration,
      actions
    })
  }

  const warning = ({ title, message, duration = 6000, actions }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-triangle-alert',
      color: 'warning',
      duration,
      actions
    })
  }

  return {
    success,
    error,
    info,
    warning
  }
}
