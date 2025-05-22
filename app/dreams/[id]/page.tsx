import { updateItem } from "@/app/actions";
import LinkPreview from "@/components/link-preview";
import Modal from "@/components/modal";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server"
import Link from "next/link";

export default async function DreamItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
	const supabase = await createClient();
	const { data } = await supabase
		.from('dreams')
		.select('*')
		.eq('id', id)
		.maybeSingle()

  return (
		<div className="flex flex-col space-y-4">
			<div>
				<Button asChild variant={'ghost'}>
					<Link href="/dreams">
						<span>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
							</svg>
						</span>
						Back
					</Link>
				</Button>
			</div>
			<LinkPreview data={data} />
			<div className="flex gap-x-3 justify-between">
				<Modal title="Update item">
				<form>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="id">ID</Label>
						<Input aria-label='item-id-input' placeholder='https://url-link-of-item.com' name='id' defaultValue={data.id} readOnly />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="url">URL</Label>
						<Input aria-label='item-url-input' placeholder='https://url-link-of-item.com' name='url' defaultValue={data.url} />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="title">Title</Label>
						<Input aria-label='item-title-input' placeholder='Custom item title' name='title' defaultValue={data.title} />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="description">Description</Label>
						<Input aria-label='item-description-input' placeholder='Custom item description' name='description' defaultValue={data.description} />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="price-amount">Price amount</Label>
						<Input type="number" aria-label='item-price-amount-input' placeholder='0.00' name='price-amount' defaultValue={data.price_amount} />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="currency">Currency</Label>
						<Input aria-label='item-currency-input' placeholder='USD' name='currency' defaultValue={data.price_currency} />
					</div>
					<SubmitButton pendingText="Updating item..." formAction={updateItem}>
						Update item
					</SubmitButton>
				</form>
				</Modal>
				<Button aria-label="Delete" size={'icon'} variant={'destructive'}>
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
						</svg>
					</span>
				</Button>
			</div>
		</div>
	)
}