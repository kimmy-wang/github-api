export default async (req, res) => {
  const { username, from, to } = req.query
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(username)
}
