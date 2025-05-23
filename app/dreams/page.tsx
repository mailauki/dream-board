import { addItem } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/server'
import LinkPreview from '@/components/link-preview'
import { Label } from "@/components/ui/label";
import Modal from "@/components/modal";
import Toolbar from "@/components/toolbar";

export default async function DreamsPage() {
  const supabase = await createClient()
  const { data: dreams } = await supabase.from('dreams').select('*')

	return (
		<>
			<Toolbar>
				<Modal title="Add to dreamboard">
					<form>
						<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
							<Label htmlFor="url">URL</Label>
							<Input aria-label='item-url-input' placeholder='https://url-link-of-item.com' name='url' />
						</div>
						<SubmitButton pendingText="Adding item..." formAction={addItem}>
							Add item
						</SubmitButton>
					</form>
				</Modal>
			</Toolbar>
			<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
				{dreams?.map(dream => <LinkPreview key={dream.id} data={dream} />)}
			</div>
		</>
	)
}