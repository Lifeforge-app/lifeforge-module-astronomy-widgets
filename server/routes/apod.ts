import z from 'zod'

import forge from '../forge'

const cache = new Map<string, unknown>()
const cacheTime = 1000 * 60 * 30

let lastFetch = 0

const APODDataSchema = z.object({
  date: z.string(),
  post_id: z.number(),
  title: z.string(),
  permalink: z.string(),
  media_type: z.enum(['image', 'video']),
  explanation: z.string(),
  credit: z.string(),
  copyright: z.string(),
  alt: z.string(),
  url: z.string(),
  hdurl: z.string(),
  basic_html: z.string(),
  basic_html_url: z.string()
})

export const get = forge
  .query({
    description: 'Get NASA Astronomy Picture of the Day',
    noAuth: true,
    encrypted: false,
    output: {
      OK: APODDataSchema
    }
  })
  .callback(
    async ({
      pb,
      response,
      core: {
        api: { getAPIKey }
      }
    }) => {
      const now = +new Date()

      if (cache.has('apod') && now - lastFetch < cacheTime) {
        return response.ok(cache.get('apod') as z.infer<typeof APODDataSchema>)
      }

      const apiKey = await getAPIKey('nasa', pb).catch(() => null)

      if (!apiKey) {
        return response.ok({
          date: new Date().toISOString().split('T')[0],
          post_id: 0,
          title: 'Missing NASA API Key',
          permalink: '',
          media_type: 'image' as const,
          explanation: 'Add a NASA API key in the API Keys manager.',
          credit: '',
          copyright: '',
          alt: '',
          url: '',
          hdurl: '',
          basic_html: '',
          basic_html_url: ''
        })
      }

      const res = await fetch(
        `https://science.nasa.gov/wp-json/wp/v2/apod-basic?api_key=${apiKey}`
      )
      const data = (await res.json())[0]

      cache.set('apod', data)
      lastFetch = now

      return response.ok(data)
    }
  )
