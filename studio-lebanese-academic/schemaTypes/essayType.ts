import {defineField, defineType} from 'sanity'

export const essayType = defineType({
  name: 'essay',
  title: 'Essay',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dek',
      title: 'Dek',
      description: 'The short argument under the title.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'byline',
      title: 'Byline',
      type: 'string',
      initialValue: 'Karim Salam',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publicationDate',
      title: 'Publication date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read time',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'Essay',
    }),
    defineField({
      name: 'tags',
      title: 'Topic tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull quote',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'arabicDisplayLine',
      title: 'Arabic display line',
      type: 'string',
    }),
    defineField({
      name: 'dateline',
      title: 'Dateline',
      type: 'string',
    }),
    defineField({
      name: 'bodyPullQuote',
      title: 'Body pull quote',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'marginaliaNote',
      title: 'Marginalia note',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'marginaliaNoteAttribution',
      title: 'Marginalia note attribution',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'credit',
          title: 'Credit',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Section heading', value: 'h2'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                  }),
                ],
              },
            ],
          },
        },
        {type: 'image', options: {hotspot: true}},
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Footnotes / citations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'text'},
          },
        },
      ],
    }),
    defineField({
      name: 'relatedSlugs',
      title: 'Related essay slugs',
      description: 'Temporary bridge while the site still supports file-based essays.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'SEO title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'SEO description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'keywords',
          title: 'SEO keywords',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
        }),
      ],
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({
          name: 'file',
          title: 'File',
          type: 'string',
        }),
        defineField({
          name: 'importedAt',
          title: 'Imported at',
          type: 'datetime',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publicationDate',
      media: 'mainImage',
    },
  },
})
