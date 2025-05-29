/* eslint-disable no-console */
'use client'

import type { Tables } from '@/types/supabase'

import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { createClient } from '@/utils/supabase/client'

import { Label } from './ui/label'
import { Input } from './ui/input'
import UserChip from './ui/user-chip'
import { Avatar } from './ui/avatar'

export default function SearchInput() {
  const supabase = createClient()
  const [value, setValue] = useState<string>('')
  const [results, setResults] = useState<Tables<'profiles'>[]>([])

  useEffect(() => {
    async function getData() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${value ? `%${value}%` : ''}, first_name.ilike.${value ? `%${value}%` : ''}, last_name.ilike.${value ? `%${value}%` : ''}`)

        if (error) {
          throw error
        }

        if (data) setResults(data)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [value, supabase])

  return (
    <>
      <form className='w-full'>
        <Label className="relative block font-normal text-sm">
          <span className="absolute inset-y-0 left-0 flex items-center px-2">
            <SearchIcon size='16' />
          </span>
          <span className="sr-only">Search</span>
          <Input
            aria-label='Search'
            className="pl-8"
            id='search'
            name="search"
            placeholder='Search...'
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Label>
      </form>
      {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}
      {results.map((user) => (
        <UserChip
          key={user.id}
          avatar={<Avatar url={user.avatar_url || ''} />}
          subheader={user.username}
          title={`${user.first_name} ${user.last_name || ''}`}
        />
      ))}
    </>
  )
}