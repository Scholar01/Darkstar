import { clsx, type ClassValue } from 'clsx';
import { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 从action的错误信息设置表单错误
 * @param setError 
 * @param errorMap
 */
export const setFormErrorsFromActionError = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errorMap: Record<string, string[]>,
) => {
  for (const [key, errors] of Object.entries(errorMap)) {
    setError(key as FieldPath<T>, {
      type: 'server',
      message: errors.join(', '),
    });
  }
};
