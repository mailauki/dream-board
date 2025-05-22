"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function Modal({
	title,
	action,
  children,
}: Readonly<{
	title: string;
	action?: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
	
  return (
		<>
			{/* <div className="fixed z-10 bottom-20 right-6 sm:right-20 md:right-1/4 md:-mr-48"> */}
			<Button
				aria-label='Toggle item dialog'
				size={title.includes("Add") ? 'icon' : 'default'}
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
							<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
						</svg>
					</span>
				)}
				{title.includes("Add") ? (
					<span className="sr-only">Add item</span>
				) : (
					<span>Edit item</span>
				)}
			</Button>
			{/* </div> */}

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