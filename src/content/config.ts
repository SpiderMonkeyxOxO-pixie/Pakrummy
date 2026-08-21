import { defineCollection, z } from 'astro:content';

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    publishDate: z.string(),
    updatedDate: z.string().optional(),
    author: z.string(),
    category: z.enum(['install', 'account', 'payments', 'games', 'troubleshooting']),
    relatedLinks: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        })
      )
      .min(2)
      .optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    publishDate: z.string(),
    updatedDate: z.string().optional(),
    author: z.string(),
    category: z.enum(['strategy', 'pakistan', 'responsible-gaming', 'payments', 'industry']),
    relatedLinks: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        })
      )
      .min(2)
      .optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const updates = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    publishDate: z.string(),
    category: z.enum(['site', 'app-version', 'content', 'policy']),
    /** True only when the change itself was confirmed against a primary source. */
    verified: z.boolean().default(false),
  }),
});

export const collections = { guides, blog, updates };
