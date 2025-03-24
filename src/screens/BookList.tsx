import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Colors } from '../constants/Colors';
import Banners from '../components/Banners';
import { fetchRemoteData, Book, Slide } from '../services/remoteConfigService';

const BookList: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
      const loadData = async () => {
        const { slides: slidesData, books: booksData } = await fetchRemoteData();
        setSlides(slidesData);
        setBooks(booksData);
      };

      loadData();
    }, []);

    const booksByGenre = useMemo(() => books.reduce((acc: Record<string, Book[]>, book: Book) => {
        if (!acc[book.genre]) {
            acc[book.genre] = [];
        }
        acc[book.genre].push(book);
        return acc;
    }, {}), [books]);

    const renderBook = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.bookItem}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
        >
            <Image
                source={{ uri: item.cover_url }}
                style={styles.bookCover}
                resizeMode="cover"
            />
            <Text style={styles.bookTitle} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
        </TouchableOpacity>
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
            <View style={styles.header}>
                <Text style={styles.title}>Library</Text>
            </View>
            <FlatList
                ListHeaderComponent={<Banners slides={slides} />}
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
    header: {
        padding: 16,
    },
    title: {
        color: Colors.primary,
        fontFamily: 'Nunito Sans',
        fontSize: 20,
        lineHeight: 22,
        fontWeight: 'bold',
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
