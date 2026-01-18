import { createContext, ReactNode, useContext, useState } from 'react';

export type CurrencyCode = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'INR';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  PKR: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rate: 278.50 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67 },
  SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rate: 3.75 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatAmount: (amountInUSD: number) => string;
  formatAmountShort: (amountInUSD: number) => string;
  convertFromUSD: (amountInUSD: number) => number;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES.PKR);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(CURRENCIES[code]);
  };

  const convertFromUSD = (amountInUSD: number): number => {
    return amountInUSD * currency.rate;
  };

  const formatAmount = (amountInUSD: number): string => {
    const converted = convertFromUSD(amountInUSD);

    // Format based on currency
    if (currency.code === 'PKR' || currency.code === 'INR') {
      // Use Indian/Pakistani numbering system (lakhs, crores)
      return `${currency.symbol} ${converted.toLocaleString('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }

    return `${currency.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatAmountShort = (amountInUSD: number): string => {
    const converted = convertFromUSD(amountInUSD);

    if (converted >= 1000000) {
      return `${currency.symbol}${(converted / 1000000).toFixed(1)}M`;
    }
    if (converted >= 1000) {
      return `${currency.symbol}${(converted / 1000).toFixed(1)}K`;
    }

    if (currency.code === 'PKR' || currency.code === 'INR') {
      return `${currency.symbol} ${Math.round(converted).toLocaleString()}`;
    }

    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const availableCurrencies = Object.values(CURRENCIES);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatAmount,
        formatAmountShort,
        convertFromUSD,
        availableCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
