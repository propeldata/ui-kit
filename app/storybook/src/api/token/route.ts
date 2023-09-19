import type { VercelRequest, VercelResponse } from '@vercel/node'

const TOKEN_AUTH_URL = process.env.TOKEN_AUTH_URL
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!(TOKEN_AUTH_URL && CLIENT_ID && CLIENT_SECRET)) {
    response.status(400).json({ error: 'Missing env variables' }).end()
    return
  }

  const responseData = await fetch(TOKEN_AUTH_URL, {
    method: 'post',
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })

  const data = await responseData.json()

  response.status(200).json(data).end()
}
