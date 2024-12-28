export type CurrencyCode = 
  | 'AED' | 'AFN' | 'ALL' | 'AMD' | 'ANG' | 'AOA' | 'ARS' | 'AUD' | 'AWG' | 'AZN'
  | 'BAM' | 'BBD' | 'BDT' | 'BGN' | 'BHD' | 'BIF' | 'BMD' | 'BND' | 'BOB' | 'BRL'
  | 'BSD' | 'BTN' | 'BWP' | 'BYN' | 'BZD' | 'CAD' | 'CDF' | 'CHF' | 'CLP' | 'CNY'
  | 'COP' | 'CRC' | 'CUP' | 'CVE' | 'CZK' | 'DJF' | 'DKK' | 'DOP' | 'DZD' | 'EGP'
  | 'ERN' | 'ETB' | 'EUR' | 'FJD' | 'FKP' | 'GBP' | 'GEL' | 'GHS' | 'GIP' | 'GMD'
  | 'GNF' | 'GTQ' | 'GYD' | 'HKD' | 'HNL' | 'HRK' | 'HTG' | 'HUF' | 'IDR' | 'ILS'
  | 'INR' | 'IQD' | 'IRR' | 'ISK' | 'JMD' | 'JPY' | 'JOD' | 'KES' | 'KGS' | 'KHR'
  | 'KMF' | 'KRW' | 'KWD' | 'KYD' | 'KZT' | 'LAK' | 'LBP' | 'LKR' | 'LRD' | 'LSL'
  | 'MAD' | 'MDL' | 'MGA' | 'MKD' | 'MMK' | 'MNT' | 'MOP' | 'MRU' | 'MUR' | 'MWK'
  | 'MXN' | 'MYR' | 'MZN' | 'NAD' | 'NGN' | 'NIO' | 'NOK' | 'NPR' | 'NZD' | 'OMR'
  | 'PAB' | 'PEN' | 'PGK' | 'PHP' | 'PKR' | 'PLN' | 'PYG' | 'QAR' | 'RON' | 'RSD'
  | 'RUB' | 'RWF' | 'SAR' | 'SBD' | 'SCR' | 'SEK' | 'SGD' | 'SHP' | 'SLL' | 'SOS'
  | 'SRD' | 'SSP' | 'STN' | 'SYP' | 'SZL' | 'THB' | 'TJS' | 'TMT' | 'TND' | 'TOP'
  | 'TRY' | 'TTD' | 'TWD' | 'TZS' | 'UAH' | 'UGX' | 'USD' | 'UYU' | 'UZS' | 'VEF'
  | 'VND' | 'VUV' | 'WST' | 'XAF' | 'XCD' | 'XOF' | 'YER' | 'ZAR' | 'ZMW' | 'ZWD';

export type WalletsResponse = {
    walletId: number
    balance: number
    currency: CurrencyCode
}

export type Transactions = {
  currency: string;
  amount: number;
  senderWallet?: number;
  recipientWallet?: number;
  transactionId?: string;
  created_at: string;
  status: 'inbound' | 'outbound';
  usdAmount: number;
  name?: string | null;
}

export type OverviewResponse = {
  availableBalance: number,
  expenses: number,
  incoming: number,
  transactions: Transactions[]
}