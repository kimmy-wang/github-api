import cheerio from 'cheerio'
import fetch from 'node-fetch'

const COLOR_MAP = {
  0: '#ebedf0',
  1: '#9be9a8',
  2: '#40c463',
  3: '#30a14e',
  4: '#216e39',
}

export async function fetchData(username, from, to) {
  let url = `https://github.com/${username}`
  if (from && to) {
    url += `?from=${from}&to=${to}`
  }
  const data = await fetch(url)
  const $ = cheerio.load(await data.text())
  const $days = $('svg.js-calendar-graph-svg rect.ContributionCalendar-day')

  const parseDay = day => {
    const $day = $(day)
    return {
      date: $day.attr('data-date'),
      count: parseInt($day.attr('data-count') || 0, 10),
      color: COLOR_MAP[$day.attr('data-level')],
    }
  }

  return $days.get().map(parseDay)
}
