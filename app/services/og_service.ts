import ogs from 'open-graph-scraper'

export interface OgData {
  title: string | null
  description: string | null
  imageUrl: string | null
  siteName: string | null
}

export async function fetchOgData(url: string): Promise<OgData> {
  try {
    const { result } = await ogs({
      url,
      timeout: 8000,
      fetchOptions: { redirect: 'follow' },
    })

    const firstImage = result.ogImage?.[0]?.url ?? null

    return {
      title: result.ogTitle ?? result.dcTitle ?? null,
      description: result.ogDescription ?? result.dcDescription ?? null,
      imageUrl: firstImage,
      siteName: result.ogSiteName ?? null,
    }
  } catch {
    return {
      title: null,
      description: null,
      imageUrl: null,
      siteName: null,
    }
  }
}
