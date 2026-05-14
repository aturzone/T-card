interface ToastProps {
  message: string;
  show: boolean;
}

export function Toast({ message, show }: ToastProps) {
  return <div className={`toast ${show ? 'show' : ''}`}>{message}</div>;
}
