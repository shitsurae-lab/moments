const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export const searchPhotos = async (
  query: string, //検索クエリ
  page: number = 1, //ページ番号
  perPage: number = 10, //1ページあたりの写真数
): Promise<UnsplashPhoto[]> => {
  if (!ACCESS_KEY) {
    throw new Error(
      'Unsplash Access Key is not set. Please set the ACCESS_KEY variable.',
    );
  }
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results; // Return the array of photo results
  } catch (error) {
    console.error('Error fetching photos from Unsplash:', error);
    throw error;
  }
};
