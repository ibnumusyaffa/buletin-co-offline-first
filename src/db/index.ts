import { type InstaQLEntity, i, init } from '@instantdb/react';

// ID for app: Buletin
const APP_ID = '9274abdd-8404-40f6-a844-5ccc4f8bfe2e';

const schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.any(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    posts: i.entity({
      title: i.string(),
      subtitle: i.string().optional(),
      slug: i.string().unique().indexed(),
      content: i.string(),
      status: i.string(),
      type: i.string(),
      createdAt: i.date(),
    }),
  },
});

export type Post = InstaQLEntity<typeof schema, "posts">;

export const db = init({ appId: APP_ID, schema });