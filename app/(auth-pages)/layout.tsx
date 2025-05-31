import { Container } from '@/components/layout/container'

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size={'sm'} variant={'column'}>{children}</Container>
  )
}
