import { deleteItem, updateItem } from "@/app/actions";
import LinkPreview from "@/components/link-preview";
import Modal from "@/components/modal";
import PriceInput from "@/components/price-input";
import { SubmitButton } from "@/components/submit-button";
import Toolbar from "@/components/toolbar";
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
		.eq('id', Number(id))
		.maybeSingle()

  return (
		<div className="flex flex-col space-y-4">
			<Toolbar>
				<div>
					<Modal title="Are you sure?">
						<div>This action is permanent.</div>
						<form>
							<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
								<Label htmlFor="id">ID</Label>
								<Input type="number" aria-label='item-id-input' placeholder='https://url-link-of-item.com' name='id' defaultValue={data!.id} readOnly />
							</div>
							<SubmitButton variant={"destructive"} pendingText="Deleting item..." formAction={deleteItem}>
								Delete item
							</SubmitButton>
						</form>
					</Modal>
				</div>
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
			</Toolbar>
			<LinkPreview data={data!} />
			<div>
				<form className="border-t mt-6 pt-3">
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
						<Label htmlFor="id">ID</Label>
						<Input type="number" aria-label='item-id-input' placeholder='https://url-link-of-item.com' name='id' defaultValue={data!.id} readOnly />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="url">URL</Label>
						<Input type="url" aria-label='Item url' placeholder='https://url-link-of-item.com' name='url' defaultValue={data!.url} />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="title">Title</Label>
						<Input aria-label='Item title' placeholder='Custom item title' name='title' defaultValue={data!.title! || ""} />
					</div>
					<div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
						<Label htmlFor="description">Description</Label>
						<textarea
							className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							aria-label='Item description'
							placeholder='Custom item description'
							name='description'
							rows={4}
							defaultValue={data!.description! || ""}
						/>
					</div>

					<PriceInput price_amount={data?.price_amount!} price_currency={data?.price_currency!} />

					<SubmitButton pendingText="Updating item..." formAction={updateItem}>
						Update item
					</SubmitButton>
				</form>
			</div>
		</div>
	)
}