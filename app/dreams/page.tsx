import LinkPreview from '@/components/link-preview'
import { createClient } from '@/utils/supabase/server'

export default async function DreamsPage() {
  const supabase = await createClient()
  const { data: dreams } = await supabase.from('dreams').select('*')

	return (
		<div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{dreams?.map(dream => <LinkPreview key={dream.id} url={dream.url} />)}
		</div>
	)
}