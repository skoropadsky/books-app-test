import remoteConfig from '@react-native-firebase/remote-config';

export interface Slide {
    id: number;
    book_id: string;
    cover: string;
}

export interface Book {
    id: number;
    author: string;
    cover_url: string;
    genre: string;
    likes: string;
    name: string;
    quotes: string;
    summary: string;
    views: string;
}

export interface RemoteData {
    slides: Slide[];
    books: Book[];
    youWillLike: number[];
}

export interface RemoteCarousel {
    books: Book[] ;
}

export const fetchRemoteData = async (): Promise<RemoteData> => {
    try {
        await remoteConfig().setDefaults({
            json_data: JSON.stringify({
                top_banner_slides: [],
                books: [],
                you_will_like_section: JSON.stringify([]),
            }),
        });

        await remoteConfig().fetchAndActivate();

        const jsonData = remoteConfig().getValue('json_data').asString();
        const parsedData = JSON.parse(jsonData);

        return {
            slides: parsedData.top_banner_slides || [],
            books: parsedData.books || [],
            youWillLike: parsedData.you_will_like_section || [],
        };
    } catch (error) {
        console.error('Error fetching remote config:', error);
        return {
            slides: [],
            books: [],
            youWillLike: [],
        };
    }
};

export const fetchDetailsCarousel = async (): Promise<RemoteCarousel> => {
    try {
        await remoteConfig().setDefaults({
            details_carousel: JSON.stringify({ books: [] }),
        });

        await remoteConfig().fetchAndActivate();

        const jsonData = remoteConfig().getValue('details_carousel').asString();
        const parsedData = JSON.parse(jsonData);

        return {
            books: parsedData.books || [],
        };
    } catch (error) {
        console.error('Error fetching remote config:', error);
        return {
            books: [],
        };
    }
};
