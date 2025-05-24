export default function Toolbar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="sticky top-16 z-10 w-full flex justify-center bg-background h-16">
      <div className="w-full max-w-5xl flex flex-row-reverse justify-between items-center p-3 px-5 text-sm">
        {children}
      </div>
    </div>
  )
}