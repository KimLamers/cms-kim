import {
  buildCollection,
  buildEntityCallbacks,
  buildProperty
} from '@camberi/firecms'

type Article = {
  publish: boolean
  showTitle: boolean
  order: number
  type: string
  img: string
  title_nl: string
  content_nl: string
  title_en: string
  content_en: string
  showContactButton: boolean
}

const articleCallbacks = buildEntityCallbacks({
  onPreSave: ({ collection, path, entityId, values, status }) => {
    values.title_nl = `${values.title_nl?.toLowerCase()}`
    values.title_en = `${values.title_en?.toLowerCase()}`
    return values
  }
})

const articleCollection = buildCollection<Article>({
  name: 'Artikel',
  singularName: 'Artikel',
  description: 'Artikelen op de website',
  path: 'articles',
  group: 'Main',
  initialSort: ['order', 'asc'],
  defaultSize: 'xs',

  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    delete: true
  }),

  properties: {
    publish: {
      name: 'Publiceren?',
      validation: { required: true },
      dataType: 'boolean',
      defaultValue: true
    },

    showTitle: {
      name: 'Titel tonen?',
      validation: { required: true },
      dataType: 'boolean',
      defaultValue: true
    },
    order: {
      name: 'Volgorde',
      validation: { required: true },
      dataType: 'number'
    },
    type: {
      name: 'Type',
      validation: { required: false },
      dataType: 'string',
      enumValues: {
        header: 'Header',
        article: 'Artikel (Wit)',
        black: 'Introductie (zwart)',
        slogan: 'Slogan'
      },
      defaultValue: 'article'
    },
    img: buildProperty({
      name: 'Afbeelding',
      dataType: 'string',
      storage: {
        storeUrl: true,
        storagePath: 'images/article',
        acceptedFiles: ['image/*']
      }
    }),
    title_nl: {
      name: 'Titel NL',
      validation: { required: true },
      dataType: 'string'
    },
    content_nl: {
      name: 'Content NL',
      markdown: true,
      dataType: 'string',
      columnWidth: 300
    },
    title_en: {
      name: 'Titel EN',
      validation: { required: true },
      dataType: 'string'
    },
    content_en: {
      name: 'Content EN',
      markdown: true,
      dataType: 'string',
      columnWidth: 300
    },
    showContactButton: {
      name: 'Toon contact-button?',
      validation: { required: true },
      dataType: 'boolean',
      defaultValue: false
    }
  },

  callbacks: articleCallbacks
})

export default articleCollection
