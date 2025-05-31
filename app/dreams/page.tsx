import { addItem } from '@/actions/items'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/server'
import LinkPreview from '@/components/link-preview'
import { Label } from '@/components/ui/label'
import Modal from '@/components/modal'
import Toolbar from '@/components/layout/toolbar'
import { Container } from '@/components/layout/container'

export default async function DreamsPage() {
  const supabase = await createClient()
  const { data: dreams } = await supabase.from('dreams').select('*')

  return (
    <>
      <Toolbar title='Dreams'>
        <Modal title="Add to dreamboard">
          <form>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
              <Label htmlFor="url">URL</Label>
              <Input aria-label='Item url' name='url' placeholder='https://url-link-of-item.com' type="url" />
            </div>
            <SubmitButton formAction={addItem} pendingText="Adding item...">
							Add item
            </SubmitButton>
          </form>
        </Modal>
      </Toolbar>
      <Container variant={'grid'}>
        {dreams?.map(dream => <LinkPreview key={dream.id} data={dream} />)}
      </Container>
    </>
  )
}