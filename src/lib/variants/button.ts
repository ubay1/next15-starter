import { cva } from 'class-variance-authority';

export const buttonVariant = cva(
  'font-semibold text-white py-1 px-3 rounded-full active:opacity-80',
  {
    variants: {
      color: {
        primary: 'bg-blue-500 hover:bg-blue-700',
        secondary: 'bg-purple-500 hover:bg-purple-700',
        success: 'bg-green-500 hover:bg-green-700'
      },
      size: {
        sm: 'py-1 px-3 text-xs',
        md: 'py-1.5 px-4 text-sm',
        lg: 'py-2 px-6 text-md'
      },
      disabled: {
        true: 'opacity-50 bg-gray-500 pointer-events-none'
      },
    },
    compoundVariants: [
      {
        color: 'success',
        disabled: true,
        className: 'bg-gray-300 text-gray-700'
      },
      {
        color: ['primary', 'secondary'],
        disabled: true,
        className: 'text-slate-700 bg-slate-300'
      }
    ],
    defaultVariants: {
      color: 'primary',
      size: 'md',
      disabled: false
    }
  }
);

// Note: cva doesn't support slots like tailwind-variants
// For icon and label styling, consider using separate cva definitions
// or compose them differently in your component
