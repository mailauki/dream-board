'use client'

import { useState } from 'react'

import { Label } from './ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function PriceInput({
  price_amount,
  price_currency,
}: {
	price_amount?: number;
	price_currency?: string;
}) {
  const [amount, setAmount] = useState<number|string|undefined>(price_amount)
  const [currency, setCurrency] = useState(price_currency)

  const currencies = [
    {
      symbol: '$',
      code: 'USD'
    },
    {
      symbol: '£',
      code: 'GBP'
    },
    {
      symbol: '€',
      code: 'EUR'
    },
    {
      symbol: '₹',
      code: 'INR'
    },
    {
      symbol: '¥',
      code: 'JPY'
    },
    {
      symbol: '฿',
      code: 'BTC'
    }
  ]

  return (
    <>
      <div className="flex flex-col gap-2 mb-3 mt-3">
        <div className="flex justify-between items-end gap-x-3">
          <Label htmlFor="price">Price</Label>
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-500">
            {(amount && currency) && (
              Intl.NumberFormat('en', {
                currency: currency,
                style: 'currency',
                trailingZeroDisplay: 'stripIfInteger'
              }).format(Number(amount))
            )}
            {/* {formatPrice({
              price_amount: amount,
              price_currency: currency
            })} */}
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} variant="ghost">
                {currencies.find(value => value.code == currency)?.symbol || '$'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-content">
              <DropdownMenuRadioGroup
                value={currency}
                onValueChange={(e) => setCurrency(e)}
              >
                {currencies.map((item) => (
                  <DropdownMenuRadioItem
                    key={item.code}
                    className="flex gap-2"
                    value={item.code}
                  >
                    {item.symbol}{' '}<span>{item.code}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            aria-label='Item price amount'
            name='price'
            placeholder='0.00'
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/,/g, ''))}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
        <Label htmlFor="price-amount">Price amount</Label>
        <Input
          readOnly
          aria-label='Item price amount'
          defaultValue={Number(amount)}
          id='price-amount'
          name='price-amount'
          placeholder='0.00'
          type="number"
        />
      </div>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
        <Label htmlFor="price-currency">Currency</Label>
        <Input
          readOnly
          aria-label='Item price currency'
          defaultValue={currency || ''}
          id='price-currency'
          name='price-currency'
          placeholder='USD'
        />
      </div>
    </>
  )
}