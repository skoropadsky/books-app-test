import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useMemo } from 'react';
import { Colors } from '../constants/Colors';
import Banners from '../components/Banners';

interface Slide {
  id: number;
  book_id: string;
  cover: string;
}

interface Book {
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

interface BookListProps {
  slides: Slide[];
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ slides, books }) => {
    const booksByGenre = useMemo(() => books.reduce((acc: Record<string, Book[]>, book: Book) => {
        if (!acc[book.genre]) {
            acc[book.genre] = [];
        }
        acc[book.genre].push(book);
        return acc;
    }, {}), [books]);

    const renderBook = ({ item }: { item: Book }) => (
        <View style={styles.bookItem}>
            <Image
                source={{ uri: item.cover_url }}
                style={styles.bookCover}
                resizeMode="cover"
            />
            <Text style={styles.bookTitle} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
        </View>
    );

    const renderGenre = (genre: string) => {
        return (
            <View key={genre} style={styles.genreSection}>
                <Text style={styles.genreTitle}>{genre}</Text>
                <FlatList
                    data={booksByGenre[genre]}
                    renderItem={renderBook}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.sliderContent}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Banners slides={slides} />
            <FlatList
                data={Object.keys(booksByGenre)}
                renderItem={({ item }) => renderGenre(item)}
                keyExtractor={(item) => item}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    genreSection: {
        marginVertical: 16,
    },
    genreTitle: {
        color: Colors.text,
        fontSize: 20,
        lineHeight: 22,
        fontWeight: '700',
        marginBottom: 16,
        marginLeft: 16,
    },
    sliderContent: {
        paddingHorizontal: 16,
    },
    bookItem: {
        marginRight: 16,
        width: 120,
    },
    bookCover: {
        width: 120,
        height: 150,
        borderRadius: 16,
        marginBottom: 8,
    },
    bookTitle: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    bookAuthor: {
        color: Colors.secondary,
        fontSize: 12,
        marginTop: 4,
    },
});

export default BookList;
