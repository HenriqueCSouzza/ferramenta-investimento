export const POSTS_LIST_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  description,
  publishedAt,
  "slug": slug.current,
  "author": author->{name, "slug": slug.current},
  "categories": categories[]->{title, "slug": slug.current},
  mainImage{
    alt,
    asset->{url}
  }
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  description,
  publishedAt,
  "slug": slug.current,
  "author": author->{name, "slug": slug.current, image{alt, asset->{url}}, bio},
  "categories": categories[]->{title, "slug": slug.current},
  mainImage{
    alt,
    asset->{url}
  },
  body
}`;
