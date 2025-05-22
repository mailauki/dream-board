import { addItem } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/server'
import LinkPreview from '@/components/link-preview'
import { Label } from "@/components/ui/label";
import Modal from "@/components/modal";

export default async function DreamsPage() {
  const supabase = await createClient()
  const { data: dreams } = await supabase.from('dreams').select('*')

	return (
		<>
			<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
				{dreams?.map(dream => <LinkPreview key={dream.id} url={dream.url} />)}
			</div>
			<Modal
				title="Add to dreamboard"
				action={addItem}
			>
				<form>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="email">URL</Label>
						<Input aria-label='item-url-input' placeholder='https://url-link-of-item.com' name='url' />
					</div>
					<SubmitButton pendingText="Adding item..." formAction={addItem}>
						Add item
					</SubmitButton>
				</form>
			</Modal>
			{/* <div className="fixed bg-blue-500 bottom-60 w-full px-60 py-20 max-w-5xl mx-auto flex justify-end">
				<form className="flex-1 flex flex-col min-w-64">
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
						<Label htmlFor="email">URL</Label>
						<Input aria-label='item-url-input' placeholder='https://url-link-of-item.com' name='url' />
						<SubmitButton pendingText="Adding item..." formAction={addItem}>
							Add item
						</SubmitButton>
					</div>
				</form>
			</div>
			<div className="fixed bottom-20 w-full px-14 max-w-5xl mx-auto flex justify-end">
				<Button aria-label='Add item' size={'icon'}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</Button>
			</div> */}
		</>
	)
}