"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitButton } from "./submit-button";

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
			<div className="fixed z-10 bottom-20 right-6 sm:right-20 md:right-1/4 md:-mr-48">
			<Button
				aria-label='Add item'
				size={'icon'}
				data-dialog-toggle="add-item-dialog"
				onClick={() => setOpen(true)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
			</Button>
			</div>

			<dialog
				open={open}
				onClose={() => setOpen(false)}
				id="add-item-dialog"
				className="collapse open:visible"
			>
				<div className="fixed inset-0 z-20 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm" aria-hidden="true" data-dialog-close="true" onClick={() => setOpen(false)}></div>
				<div className="fixed inset-0 z-30 h-fit min-w-md max-w-2xl md:mt-60 mx-auto">
					<div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 m-4">
						<div className="flex items-center justify-between gap-x-3 p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								{title}
							</h3>
							<Button
								size={'icon'}
								data-modal-hide="add-item-dialog"
								onClick={() => setOpen(false)}
								variant={'ghost'}
							>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
								<span className="sr-only">Close modal</span>
							</Button>
						</div>
						<div className="p-4 space-y-4">
							{children}
						</div>
						<div className="flex flex-row-reverse items-center gap-x-3 p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
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
						</div>
					</div>
				</div>
			</dialog>
		</>
	)
}