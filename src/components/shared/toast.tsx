export interface ToastData {
  id: string;
  text: string;
}

export interface ToastProps {
  toast: ToastData | null;
}

/** Transient confirmation pill at the bottom of the screen. */
export function Toast({ toast }: ToastProps) {
  if (!toast) return null;
  return (
    <div className="toast" key={toast.id}>
      <span className="toast-dot" />
      {toast.text}
    </div>
  );
}
