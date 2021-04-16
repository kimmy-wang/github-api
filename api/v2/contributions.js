import { fetchV2Data } from '../../utils/fetch'

export default async (req, res) => {
  const { username, from, to } = req.query
  const contributions = await fetchV2Data(username, from, to)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(contributions)
}
