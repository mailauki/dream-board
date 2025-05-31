import { Container } from './container'

export default function Toolbar({
  title,
  children,
}: Readonly<{
	title?: string;
  children?: React.ReactNode;
}>) {
  return (
    <div className="sticky top-16 z-10 w-full flex justify-center bg-background h-16 border-b">
      <Container variant={'row'}>
        {title && (
          <div className="flex-1">
            <h1 className="text-3xl">{title}</h1>
          </div>
        )}
        {children}
      </Container>
    </div>
  )
}