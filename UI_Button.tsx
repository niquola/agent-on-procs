type ButtonVariant = "primary" | "danger" | "outline" | "ghost" | "success";

type ButtonProps = {
  action?: string;
  type?: "submit" | "button";
  variant?: ButtonVariant;
  children: string;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition duration-200",
  success: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200",
  danger: "text-sm px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 transition",
  outline: "text-sm px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition",
  ghost: "text-gray-400 hover:text-gray-600 leading-none",
};

export function UI_Button({ action, type = "button", variant = "primary", children }: ButtonProps): string {
  const cls = VARIANT_CLASSES[variant];
  return (
    <button type={type} data-action={action} className={cls}>
      {children}
    </button>
  );
}
