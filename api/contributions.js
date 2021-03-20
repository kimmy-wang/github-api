import { fetchData } from '../utils/fetch'

export default async (req, res) => {
  const { username, from, to } = req.query
  const contributions = await fetchData(username, from, to)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(contributions)
}
