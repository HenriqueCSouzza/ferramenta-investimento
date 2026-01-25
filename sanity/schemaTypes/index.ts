import { type SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, categoryType, authorType, postType],
};
