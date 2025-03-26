import { getLiveStory, useStoryblokApi, type ISbStoriesParams } from "@storyblok/astro";
import type { AstroGlobal } from "astro";
console.log("🚀 ~ META ENV:", import.meta.env.STORYBLOK_IS_PREVIEW)

export type TSOptions = {
  version?: 'draft' | 'published';
  resolve_links?: 'link' | 'url' | 'story' | '0' | '1';
  resolve_relations?: string | string[];
  is_startpage?: boolean;
  content_type?: string;
  starts_with?: string;
}
/**
 * * FUNCTION: GetStory()
 * @param Astro | Astro global needed for getLiveStory
 * @param storySlug | slug to get stories from
 * @param storyOptions | object
 * - Expects type TSOptions which takes the same types as ISbStoriesParams 
 *   just not as many options. storyOptions should be able to overide and add
 *   as needed. Revise or overide storyOptions type if needed.
 * @returns story
 */
const isPreview = import.meta.env.STORYBLOK_IS_PREVIEW;
export async function GetStory(Astro: Readonly<AstroGlobal>, storySlug: string, storyOptions?: ISbStoriesParams) {
  let story = null;
  const liveStory = await getLiveStory(Astro);
  // console.log("🚀 ~ GetStory ~ liveStory:", liveStory)
  const defaultVersion = import.meta.env.DEV ? "draft" : "published";

  const options: ISbStoriesParams = {
    version: isPreview === 'yes' ? 'draft' : defaultVersion,
    resolve_links: 'url',
    ...storyOptions,
  }
  console.log("🚀 ~ GetStory ~ options:", options)
  if (liveStory) {
    story = liveStory;
    // options.version= 'draft';
  } else {
    const storyAPI = useStoryblokApi();
    const { data } = await storyAPI.get(`cdn/stories${storySlug}`, options );
    story = data?.story;
  }
  
  return story;
}

/**
 * * FUNCTION: GetStories()
 * @param Astro | Astro global needed for getLiveStory
 * @param storyOptions | object
 * - Expects type TSOptions which takes the same types as ISbStoriesParams 
 *   just not as many options. storyOptions should be able to overide and add
 *   as needed. Revise or overide storyOptions type if needed.
 * @returns stories
 */
export async function GetStories(Astro: Readonly<AstroGlobal>, storyOptions?: TSOptions) {
  let stories = null;
  const liveStory = await getLiveStory(Astro);
  const defaultVersion = import.meta.env.DEV ? "draft" : "published";

  const options: ISbStoriesParams = {
    version: defaultVersion,
    resolve_links: 'url',
    ...storyOptions,
  }
  if (liveStory) {
    stories = liveStory;
  } else {
    const storyAPI = useStoryblokApi();
    const { data } = await storyAPI.get(`cdn/stories`, options );
    stories = data?.stories;
  }
  
  return stories;
}