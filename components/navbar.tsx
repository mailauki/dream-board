import Link from 'next/link'

import HeaderAuth from './header-auth'
import { Container } from './layout/container'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 w-full flex justify-center border-b border-b-foreground/10 bg-background h-16">
      <Container className='text-sm' variant={'row'}>
        <div className="flex gap-5 items-center font-semibold text-lg">
          <Link href={'/'}>
            <span className='font-bold'>dream</span>
            <span className='font-light'>board</span>
          </Link>
          {/* <Link href={'/dreams'}>Dreams</Link>
          <Link href={'/friends'}>Friends</Link> */}
        </div>
        <HeaderAuth />
      </Container>
    </nav>
  )
}