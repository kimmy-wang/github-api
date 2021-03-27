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

export async function fetchPinnedData(username) {
  const data = await fetch(`https://github.com/${username}`)
  const $ = cheerio.load(await data.text())
  const $days = $('ol.js-pinned-items-reorder-list div.pinned-item-list-item-content')

  const parseDay = day => {
    const $day = $(day)
    const $repo = $day.find('.repo')
    const $description = $day.find('.pinned-item-desc')
    const $language = $day.find('[itemprop=programmingLanguage]')
    const $color = $day.find('.repo-language-color')
    const $stars = $day.find('[aria-label=stars]')
    const $forks = $day.find('[aria-label=forks]')
    const owner = $day
      .find('.repo')
      .parent('.text-bold')
      .attr('href')
      .substring(1)
      .split('/')[0]
    return {
      owner,
      avatar: `https://github.com/${owner}.png`,
      name: $repo.text().trim(),
      description: $description ? $description.text().trim() : '',
      language: $language.text().trim(),
      color: $color
        .attr('style')
        .replace('background-color: ', '')
        .trim(),
      stars: !$stars
        ? 0
        : parseInt(
            $stars
              .parent('.pinned-item-meta.Link--muted')
              .text()
              .trim(),
            10,
          ),
      forks: !$forks
        ? 0
        : parseInt(
            $forks
              .parent('.pinned-item-meta.Link--muted')
              .text()
              .trim(),
            10,
          ),
    }
  }

  return !$days ? [] : $days.get().map(parseDay)
}
