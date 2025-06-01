/* eslint-disable @next/next/no-img-element */
import type { Tables } from '@/types/supabase'

import Link from 'next/link'
import { ArrowUpRightFromSquareIcon } from 'lucide-react'

import { extractMetaTags, formatPrice } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/server'

import { Button } from './ui/button'

async function LinkPreview({ data }: { data: Tables<'dreams'> }) {
  const supabase = await createClient()
  const meta = await extractMetaTags(data.url)

  if (!meta) {
    return <p>Failed to fetch link preview.</p>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', data.user_id)
    .single()

  return (
    <div className="flex max-w-xl flex-col items-start justify-between rounded border p-2">
      <Link href={`/${profile?.username}/dreams/${data.id}`}>
        <div className="relative flex w-full items-center gap-x-4">
          <img
            alt="Link Preview"
            className="h-60 w-full object-cover rounded bg-gray-50 border"
            src={meta.image}
          />
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg/6 font-semibold text-gray-900  dark:text-gray-300">
            {data.title || meta.title}
          </h3>
          <p className="mb-8 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-500">{data.description || meta.description}</p>
        </div>
      </Link>
      <div className="w-full flex justify-between items-center gap-x-4 text-xs">
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-400">
          {formatPrice({
            price_amount: data.price_amount! || meta.price,
            price_currency: data.price_currency! || meta.currency
          })}
        </p>
        <Button asChild size="sm" variant={'default'}>
          <Link href={data.url || meta.baseURL} target="_blank">
						Where to buy
            <span>
              <ArrowUpRightFromSquareIcon />
            </span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default LinkPreview