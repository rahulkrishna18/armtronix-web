import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/construction", "/engineering", "/transmission", "/technologies", "/about", "/contact", "/faq"];
  return routes.map((r) => ({
    url: `${SITE.url}${r}`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : r === "/contact" ? 0.8 : 0.7,
  }));
}
