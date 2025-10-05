import { InputHTMLAttributes } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Radio = ({
  label,
  description,
  className = '',
  ...props
}: RadioProps) => {
  return (
    <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
      props.checked 
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
    } ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="radio"
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <span className="font-medium text-gray-900 dark:text-white">{label}</span>
        {description && (
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </label>
  );
};
