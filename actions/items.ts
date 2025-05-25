/* eslint-disable no-console */
'use server'

import type { Tables } from '@/types/supabase'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export const addItem = async (formData: FormData) => {
  const supabase = await createClient()
  const url = formData.get('url')?.toString()

  console.log(url)

  const { data: { user } } = await supabase.auth.getUser()


  const { data, error } = await supabase
    .from('dreams')
    .insert([
      { url: url!, user_id: user?.id || '' },
    ])
    .select('*')

  if (error) {
    throw error // Throw the Supabase error to be caught
  }

  console.log(data)
  redirect('/dreams')
}

export const updateItem = async (formData: FormData) => {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()
  const url = formData.get('url')?.toString()
  const title = formData.get('title')?.toString()
  const description = formData.get('description')?.toString()
  const price_amount = formData.get('price_amount')?.toString()
  const price_currency = formData.get('price_currency')?.toString()

  console.log({ id, url, title, description, price_amount, price_currency })

  function formatFormData({ url, title, description, price_amount, price_currency }: Omit<Tables<'dreams'>, 'id'| 'created_at'>) {
    const dataTitle = !title ? null : title
    const dataDescription = !description ? null : description
    const dataPriceAmount = (!price_amount || price_amount == 0) ? null : price_amount
    const dataPriceCurrency = (!price_amount || price_amount == 0) ? null : !price_currency ? 'USD': price_currency

    return Object.assign({
      url,
      title: dataTitle,
      description: dataDescription,
      price_amount: dataPriceAmount,
      price_currency: dataPriceCurrency,
    })
  }

  const { data: { user } } = await supabase.auth.getUser()

  const formattedFormData: Omit<Tables<'dreams'>, 'id'| 'created_at'> = formatFormData({
    url: url!,
    title: title!,
    description: description!,
    price_amount: Number(price_amount || 0),
    price_currency: price_currency!,
    user_id: user?.id || '',
  })

  console.log(formattedFormData)

  const { data, error } = await supabase
    .from('dreams')
    .update(formattedFormData)
    .eq('id', Number(id!))
    .select('*')

  if (error) {
    throw error // Throw the Supabase error to be caught
  }

  console.log({data})
  redirect(`/dreams/${id}`)
}

export const deleteItem = async (formData: FormData) => {
  const supabase = await createClient()
  const id = formData.get('id')?.toString()

  const { error } = await supabase
    .from('dreams')
    .delete()
    .eq('id', Number(id!))

  if (error) {
    throw error // Throw the Supabase error to be caught
  }

  redirect('/dreams')
}
