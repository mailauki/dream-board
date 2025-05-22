
import { JSDOM } from "jsdom";
import type { MetaTags, Tags } from "./types";

export function formatPrice({
	price_amount,
	price_currency,
	meta_data,
}: {
	price_amount?: number;
	price_currency?: string;
	meta_data: MetaTags;
}) {
	if (price_amount && price_currency) {
		return Intl.NumberFormat('en', {
			currency: price_currency,
			style: 'currency',
			trailingZeroDisplay: "stripIfInteger"
		}).format(Number(price_amount));
	}
	else if (meta_data.price && meta_data.currency) {
		return Intl.NumberFormat('en', {
			currency: meta_data.currency,
			style: 'currency',
			trailingZeroDisplay: "stripIfInteger"
		}).format(Number(meta_data.price));
	} else {
		return null;
	}
}

export async function extractMetaTags(url: string) {
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