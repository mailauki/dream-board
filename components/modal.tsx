'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon, XIcon } from 'lucide-react'

import { Button } from './ui/button'

export default function Modal({
  title,
  children,
}: Readonly<{
	title: string;
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        aria-label='Toggle item dialog'
        data-dialog-toggle="item-dialog"
        size={'icon'}
        variant={title.includes('Add') ? 'default' : 'ghost'}
        onClick={() => setOpen(true)}
      >
        {title.includes('Add') ? (
          <span>
            <PlusIcon />
          </span>
        ) : (
          <span>
            <TrashIcon />
          </span>
        )}
        {title.includes('Add') ? (
          <span className="sr-only">Add item</span>
        ) : (
          <span className="sr-only">Delete item</span>
        )}
      </Button>

      <dialog
        className="collapse open:visible"
        id="item-dialog"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div aria-hidden="true" className="fixed inset-0 z-20 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm" data-dialog-close="true" onClick={() => setOpen(false)} />

        <div className="fixed inset-y-20 inset-x-0 z-30 h-fit min-w-md max-w-2xl mx-auto">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 m-4">
            <div className="flex items-center justify-between gap-x-3 p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <Button
                data-modal-hide="item-dialog"
                size={'icon'}
                variant={'ghost'}
                onClick={() => setOpen(false)}
              >
                <span>
                  <XIcon />
                </span>
                <span className="sr-only">Close item dialog</span>
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {children}
            </div>
            {/* <div className="flex flex-row-reverse items-center gap-x-3 p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
							<SubmitButton
								pendingText="Submitting..."
								formAction={action}
								data-dialog-close="true"
								onClick={() => setOpen(false)}
							>
								Submit
							</SubmitButton>
							<Button
								variant={'outline'}
								data-dialog-close="true"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
						</div> */}
          </div>
        </div>
      </dialog>
    </>
  )
}