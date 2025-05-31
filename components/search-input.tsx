/* eslint-disable no-console */
'use client'

import type { Tables } from '@/types/supabase'

import { MoreVerticalIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { createClient } from '@/utils/supabase/client'

import { Label } from './ui/label'
import { Input } from './ui/input'
import UserChip from './ui/user-chip'
import { Avatar } from './ui/avatar'
import { Button } from './ui/button'
import Toolbar from './layout/toolbar'

export default function SearchInput() {
  const supabase = createClient()
  const [value, setValue] = useState<string>('')
  const [results, setResults] = useState<Tables<'profiles'>[]>([])

  useEffect(() => {
    async function getData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${value ? `%${value}%` : ''}, first_name.ilike.${value ? `%${value}%` : ''}, last_name.ilike.${value ? `%${value}%` : ''}`)
          .not('user_id', 'eq', user?.id)

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
      <Toolbar title='Friends'>
        <form className='w-full max-w-md'>
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
      </Toolbar>
      {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}
      <div className='flex flex-col gap-y-4'>
        {results.map((user) => (
          <UserChip
            key={user.id}
            action={
              <Button asChild className='size-12' size={'icon'} variant={'secondary'}>
                <Link href={`/users/${user.username}`}>
                  <MoreVerticalIcon />
                </Link>
              </Button>
            }
            avatar={<Avatar url={user.avatar_url || ''} />}
            subheader={user.username}
            title={`${user.first_name} ${user.last_name || ''}`}
          />
        ))}
      </div>
    </>
  )
}