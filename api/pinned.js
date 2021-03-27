import {fetchPinnedData} from "../utils/fetch";

export default async (req, res) => {
  const { username } = req.query
  const pinned = await fetchPinnedData(username)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(pinned)
}
