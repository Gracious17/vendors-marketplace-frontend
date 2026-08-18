import React from 'react';
import { DollarSign } from 'lucide-react';

interface CurrencySelectorProps {
  value: 'USD' | 'NGN';
  onChange: (currency: 'USD' | 'NGN') => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <DollarSign className="h-4 w-4 text-gray-600" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'USD' | 'NGN')}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        <option value="USD">USD ($)</option>
        <option value="NGN">NGN (₦)</option>
      </select>
    </div>
  );
};

export default CurrencySelector;