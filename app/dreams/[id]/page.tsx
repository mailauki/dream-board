import Link from 'next/link'

import { deleteItem, updateItem } from '@/app/actions'
import LinkPreview from '@/components/link-preview'
import Modal from '@/components/modal'
import PriceInput from '@/components/price-input'
import { SubmitButton } from '@/components/submit-button'
import Toolbar from '@/components/toolbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/server'

export default async function DreamItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
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
                <Input readOnly aria-label='item-id-input' defaultValue={data!.id} name='id' placeholder='https://url-link-of-item.com' type="number" />
              </div>
              <SubmitButton formAction={deleteItem} pendingText="Deleting item..." variant={'destructive'}>
								Delete item
              </SubmitButton>
            </form>
          </Modal>
        </div>
        <Button asChild variant={'ghost'}>
          <Link href="/dreams">
            <span>
              <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
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
            <Input readOnly aria-label='item-id-input' defaultValue={data!.id} name='id' placeholder='https://url-link-of-item.com' type="number" />
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
            <Label htmlFor="url">URL</Label>
            <Input aria-label='Item url' defaultValue={data!.url} name='url' placeholder='https://url-link-of-item.com' type="url" />
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
            <Label htmlFor="title">Title</Label>
            <Input aria-label='Item title' defaultValue={data!.title! || ''} name='title' placeholder='Custom item title' />
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
            <Label htmlFor="description">Description</Label>
            <textarea
              aria-label='Item description'
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue={data!.description! || ''}
              name='description'
              placeholder='Custom item description'
              rows={4}
            />
          </div>

          <PriceInput
            price_amount={data?.price_amount || 0}
            price_currency={data?.price_currency || ''}
          />

          <SubmitButton formAction={updateItem} pendingText="Updating item...">
						Update item
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}