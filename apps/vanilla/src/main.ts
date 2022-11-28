import '@propeldata/wc-time-series'
import '@propeldata/wc-counter'

const labels = [
  '2022-10-25T00:00:00.000Z',
  '2022-10-26T00:00:00.000Z',
  '2022-10-27T00:00:00.000Z',
  '2022-10-28T00:00:00.000Z',
  '2022-10-29T00:00:00.000Z',
  '2022-10-30T00:00:00.000Z',
  '2022-10-31T00:00:00.000Z'
]

const values = [0, 100, 200, 300, 400, 500, 700]

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
document.querySelector<HTMLDivElement>('#time-series')!.innerHTML = `
  <wc-time-series labels='${JSON.stringify(labels)}' values='${JSON.stringify(values)}'></wc-time-series>  
`

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
document.querySelector<HTMLDivElement>('#counter')!.innerHTML = `
  <wc-counter metric="queryCount" accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NjkzMTA0MjIsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjY5MzE0MDIyLCJpYXQiOjE2NjkzMTA0MjIsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiNTVhMjU2NTktZGQ3YS00ZmYxLTg3NzctZTFmOTU0YzVlYzJmIiwicHJvcGVsL3RlbmFudCI6IkVOVjAxRlgzNjA2UjJLUUZRWVhYMzRBOTZRNlpSIiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.atJiIdrPZaAeWk1Fwr3u58bwEdt4KVNvNGyZhla3cJ0"></wc-counter>  
`
