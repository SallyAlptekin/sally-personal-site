import rss from '@astrojs/rss';
import { SITE } from '../data/site';
import { getPublishedPosts } from '../utils/tags';

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: `${SITE.name} — Blog`,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
