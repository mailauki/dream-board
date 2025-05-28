import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'

import { deleteItem, updateItem } from '@/actions/items'
import LinkPreview from '@/components/link-preview'
import Modal from '@/components/modal'
import PriceInput from '@/components/price-input'
import { SubmitButton } from '@/components/submit-button'
import Toolbar from '@/components/toolbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/server'
import { TextArea } from '@/components/ui/textarea'

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
    <>
      <Toolbar>
        <div>
          <Modal title="Are you sure?">
            <div>This action is permanent.</div>
            <form>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
                <Label htmlFor="id">ID</Label>
                <Input readOnly aria-label='item-id-input' defaultValue={data!.id} name='id' placeholder='https://url-link-of-item.com' type="number" />
              </div>
              <SubmitButton
                formAction={deleteItem}
                pendingText="Deleting item..."
                variant={'destructive'}
              >
								Delete item
              </SubmitButton>
            </form>
          </Modal>
        </div>
        <Button asChild variant={'ghost'}>
          <Link href="/dreams">
            <span>
              <ChevronLeftIcon />
            </span>
						Back
          </Link>
        </Button>
      </Toolbar>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <LinkPreview data={data!} />
        <div>
          <form className="border-t mt-6 pt-3">
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
              <Label htmlFor="item-id">ID</Label>
              <Input
                readOnly
                defaultValue={data!.id}
                id='item-id'
                name='item-id'
                placeholder='https://url-link-of-item.com'
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
              <Label htmlFor="url">URL</Label>
              <Input
                defaultValue={data!.url}
                id='url'
                name='url'
                placeholder='https://url-link-of-item.com'
                type="url"
              />
            </div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
              <Label htmlFor="title">Title</Label>
              <Input
                defaultValue={data!.title! || ''}
                id='title'
                name='title'
                placeholder='Custom item title'
              />
            </div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
              <Label htmlFor="description">Description</Label>
              <TextArea
                defaultValue={data!.description! || ''}
                id='description'
                name='description'
                placeholder='Custom item description'
                rows={4}
              />
            </div>

            <PriceInput
              price_amount={data?.price_amount || 0}
              price_currency={data?.price_currency || ''}
            />

            <SubmitButton
              formAction={updateItem}
              pendingText="Updating item..."
            >
						Update item
            </SubmitButton>
          </form>
        </div>
      </div>
    </>
  )
}