export interface AvalonTextFieldProps {
  label: string
  modelValue: string
  type?: 'text' | 'password'
  placeholder?: string
  error?: string
  disabled?: boolean
  maxlength?: number
  /** Hide the label visually but keep it for assistive tech (bar-style search boxes). */
  labelHidden?: boolean
}
