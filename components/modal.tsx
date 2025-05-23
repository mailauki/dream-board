"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function Modal({
	title,
  children,
}: Readonly<{
	title: string;
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
	
  return (
		<>
			<Button
				aria-label='Toggle item dialog'
				size={'icon'}
				variant={title.includes("Add") ? 'default' : 'ghost'}
				data-dialog-toggle="item-dialog"
				onClick={() => setOpen(true)}
			>
				{title.includes("Add") ? (
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</span>
				) : (
					<span>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
							</svg>
						</span>
				)}
				{title.includes("Add") ? (
					<span className="sr-only">Add item</span>
				) : (
					<span className="sr-only">Delete item</span>
				)}
			</Button>

			<dialog
				open={open}
				onClose={() => setOpen(false)}
				id="item-dialog"
				className="collapse open:visible"
			>
				<div className="fixed inset-0 z-20 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm" aria-hidden="true" data-dialog-close="true" onClick={() => setOpen(false)}></div>

				<div className="fixed inset-y-20 inset-x-0 z-30 h-fit min-w-md max-w-2xl mx-auto">
					<div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 m-4">
						<div className="flex items-center justify-between gap-x-3 p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								{title}
							</h3>
							<Button
								size={'icon'}
								data-modal-hide="item-dialog"
								onClick={() => setOpen(false)}
								variant={'ghost'}
							>
								<span>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
									</svg>
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