import type { AxiosInstance } from 'axios'

const ACCESS_TOKEN_VALUE = process.env.STORYBOOK_PROPEL_ACCESS_TOKEN
const TOKEN_URL_VALUE = process.env.STORYBOOK_TOKEN_URL

export async function fetchStorybookAccessToken(axiosInstance: AxiosInstance) {
  if (ACCESS_TOKEN_VALUE) return ACCESS_TOKEN_VALUE

  if (TOKEN_URL_VALUE === '') {
    return console.error('STORYBOOK_TOKEN_URL is not defined')
  }

  const res = await axiosInstance.get(TOKEN_URL_VALUE as string)

  return res.data.access_token
}
