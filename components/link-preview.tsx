import Link from "next/link";
import { Button } from "./ui/button";
import { extractMetaTags, formatPrice } from "@/utils/helpers";
import type { Tables } from "@/types/supabase";

async function LinkPreview({ data }: { data: Tables<'dreams'> }) {
  const meta = await extractMetaTags(data.url);

  if (!meta) {
    return <p>Failed to fetch link preview.</p>;
  }

  return (
		<div className="flex max-w-xl flex-col items-start justify-between rounded border p-2">
			<Link href={`/dreams/${data.id}`}>
				<div className="relative flex w-full items-center gap-x-4">
					<img
						src={meta.image}
						alt="Link Preview"
						className="h-60 w-full object-cover rounded bg-gray-50 border"
					/>
				</div>
				<div className="group relative">
					<h3 className="mt-3 text-lg/6 font-semibold text-gray-900  dark:text-gray-300">
						{data.title || meta.title}
					</h3>
					<p className="mb-8 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-500">{data.description || meta.description}</p>
				</div>
			</Link>
			<div className="w-full flex justify-between items-center gap-x-4 text-xs">
				<p className="text-2xl font-semibold text-gray-900 dark:text-gray-400">
					{formatPrice({ price_amount: data.price_amount!, price_currency: data.price_currency!, meta_data: meta })}
				</p>
				<Button asChild size="sm" variant={"default"}>
					<Link href={data.url || meta.baseURL} target="_blank">
						Where to buy
						<span>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
							</svg>
						</span>
					</Link>
				</Button>
			</div>
		</div>
  );
}

export default LinkPreview;