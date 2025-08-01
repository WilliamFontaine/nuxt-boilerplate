interface ToastOptions {
  title: string
  message: string
}

export const useNotifications = () => {
  const toast = useToast()

  const success = ({ title, message }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-check-circle',
      color: 'success'
    })
  }

  const error = ({ title, message }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-x-circle',
      color: 'error'
    })
  }

  const info = ({ title, message }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-info',
      color: 'info'
    })
  }

  const warning = ({ title, message }: ToastOptions) => {
    toast.add({
      title,
      description: message,
      icon: 'i-lucide-triangle-alert',
      color: 'warning'
    })
  }

  return {
    success,
    error,
    info,
    warning
  }
}
