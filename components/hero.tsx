import Link from 'next/link'

import { Container } from './layout/container'
import { Button } from './ui/button'

export default function Hero() {
  return (
    <Container className='flex-1 justify-center' size={'lg'} variant={'column'}>
      <div className="text-center">
        <h1 className="text-5xl font-medium tracking-tight text-balance text-gray-900 dark:text-gray-100 sm:text-7xl">
          {'Welcome to '}
          <span className='font-bold'>dream</span>
          <span className='font-light'>board</span>
        </h1>
        <p className="mt-8 text-lg text-balance text-gray-500 sm:text-xl/8">Welcome to our app! Here you can create and manage your wishlists. Let's get started!</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size={'lg'}>
            <Link href='/sign-up'>
						Get started
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}
