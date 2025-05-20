import Link from "next/link";
import { JSDOM } from "jsdom";

interface Tags { [key: string]: string | string[] | undefined }
interface MetaTags {
	title: string,
	description: string,
	image: string,
	price: string,
	currency: string,
	baseURL: string,
}

const extractMetaTags = async (url: string) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document: Document = dom.window.document;
    const metaTags = Array.from(document.querySelectorAll("meta")).reduce(
      (tags: Tags, meta: HTMLMetaElement) => {
        const name =
          meta.getAttribute("name") ||
          meta.getAttribute("property") ||
          meta.getAttribute("itemprop");
        const content = meta.getAttribute("content");

        if (name && content) {
          tags[name] = content;
        }

        return tags;
      },
      {}
    );

    return {
      title:
        document.title || metaTags["og:title"] || metaTags["twitter:title"],
      description:
        metaTags.description ||
        metaTags["og:description"] ||
        metaTags["twitter:description"],
      image:
        metaTags.image || metaTags["og:image"] || metaTags["twitter:image"],
			price: metaTags.price || metaTags["og:price:amount"],
			currency: metaTags.currency || metaTags["og:price:currency"],
			baseURL: new URL(url).origin,
    } as MetaTags;
  } catch (error) {
    console.error("Error fetching Open Graph details", error);
  }
};

async function LinkPreview({ url }: { url: string }) {
   //here calling the function
  const data = await extractMetaTags(url);

  if (!data) {
    return <p>Failed to fetch link preview.</p>;
  }

  return (
		<div className="flex max-w-xl flex-col items-start justify-between rounded border p-2">
			<div className="relative flex items-center gap-x-4">
				<img
					src={data.image}
					alt="Link Preview"
					className="h-60 w-full object-cover rounded bg-gray-50 border"
				/>
			</div>
			<div className="group relative">
				<h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
					<a href="#">
						<span className="absolute inset-0"></span>
						{data.title}
					</a>
				</h3>
				<p className="mb-8 line-clamp-3 text-sm/6 text-gray-600">{data.description}</p>
			</div>
			<div className="w-full flex justify-between items-center gap-x-4 text-xs">
				<p className="text-2xl font-semibold text-gray-900 group-hover:text-gray-600">
					{Intl.NumberFormat('en', {
						currency: data.currency,
						style: 'currency',
						trailingZeroDisplay: "stripIfInteger"
					}).format(Number(data.price))}
				</p>
				<a href={data.baseURL} target="_blank" className="flex items-center gap-x-2 relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
					Where to buy
					<span>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
					</span>
				</a>
			</div>
		</div>
  );
}

export default LinkPreview;