export default function UserChip({
  avatar,
  action,
  title,
  subheader,
}: {
	avatar?: React.ReactNode,
	action?: React.ReactNode,
	title?: string,
	subheader?: string | null,
}) {
  return (

    <div className='w-full max-w-xs flex justify-start items-center p-1 border rounded-full bg-background'>
      {avatar}
      <div className='flex-1 px-4'>
        <p>{title}</p>
        <p className='text-xs text-gray-500'>{subheader}</p>
      </div>
      {action}
    </div>
  )
}