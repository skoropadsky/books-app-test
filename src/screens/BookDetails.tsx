import { StyleSheet, Text, View, Image, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Colors } from '../constants/Colors';
import { Book, fetchDetailsCarousel } from '../services/remoteConfigService';
import Carousel from 'react-native-snap-carousel';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 200;
const BOTTOM_SHEET_HEIGHT = Dimensions.get('window').height - 420;

const BookDetails: React.FC<{ route: { params: { book: Book, youWillLike: number[] } } }> = ({ route }) => {
    const { book, youWillLike } = route.params;
    const [carouselBooks, setCarouselBooks] = useState<Book[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<any>(null);
    const translateY = useRef(new Animated.Value(0)).current;

    // Get current book from carousel
    const currentBook = useMemo(() =>
        carouselBooks[activeIndex] || book,
    [carouselBooks, activeIndex, book]);

    const youWillLikeBooks = useMemo(() => {
        return carouselBooks.filter((item: Book) => youWillLike?.includes(item.id));
    }, [carouselBooks, youWillLike]);

    useEffect(() => {
        fetchDetailsCarousel().then(({ books }: { books: Book[] }) => {
            if (books.length > 0) {
                // Find the index of the book from props
                const initialIndex = books.findIndex(b => b.id === book.id);
                setCarouselBooks(books);

                // If book is found, set the initial index and scroll to it
                if (initialIndex !== -1) {
                    setActiveIndex(initialIndex);
                    // Wait for carousel to be ready before scrolling
                    setTimeout(() => {
                        carouselRef.current?.snapToItem(initialIndex);
                    }, 100);
                }
            }
        });
    }, [book.id]);

    const renderCarouselItem = ({ item }: { item: Book }) => (
        <View style={styles.carouselItem}>
            <Image
                source={{ uri: item.cover_url }}
                style={styles.carouselCover}
                resizeMode="cover"
            />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
        </View>
    );

    const renderBottomSheet = () => (
        <Animated.View
            style={[
                styles.bottomSheet,
                {
                    transform: [{ translateY }],
                },
            ]}
        >
            <View style={styles.bottomSheetContent}>
                <View style={styles.bottomSheetHandle} />

                <ScrollView style={styles.bottomSheetScrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.stats}>
                        <View style={styles.statsItem}>
                            <Text style={styles.statsText}>{currentBook.views}</Text>
                            <Text style={styles.statsTextLabel}>Readers</Text>
                        </View>
                        <View style={styles.statsItem}>
                            <Text style={styles.statsText}>{currentBook.likes}</Text>
                            <Text style={styles.statsTextLabel}>Likes</Text>
                        </View>
                        <View style={styles.statsItem}>
                            <Text style={styles.statsText}>{currentBook.quotes}</Text>
                            <Text style={styles.statsTextLabel}>Quotes</Text>
                        </View>
                        <View style={styles.statsItem}>
                            <Text style={styles.statsText}>{'Hot 🌶️'}</Text>
                            <Text style={styles.statsTextLabel}>Genre</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={styles.summary}>{currentBook.summary}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>You will also like</Text>

                        <FlatList
                            data={youWillLikeBooks}
                            renderItem={({ item }: { item: Book }) => (
                                <TouchableOpacity
                                    style={styles.bookItem}
                                    onPress={() => { setActiveIndex(item.id); carouselRef.current?.snapToItem(item.id); }}
                                >
                                    <Image
                                        source={{ uri: item.cover_url }}
                                        style={styles.bookCover}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.bookLikeTitle} numberOfLines={2}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item: Book) => item.id.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <TouchableOpacity style={styles.readNowButton} onPress={() => ({})} >
                        <Text style={styles.readNowButtonText}>Read now</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Animated.View>
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.mainContent}>
                {carouselBooks.length > 0 && (
                    <View style={styles.carouselSection}>
                        <Carousel
                            ref={carouselRef}
                            data={carouselBooks}
                            renderItem={({ item }: { item: unknown }) => renderCarouselItem({ item: item as Book })}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            onSnapToItem={setActiveIndex}
                            loop={false}
                            autoplay={false}
                            layout="default"
                            useScrollView={true}
                            vertical={false}
                        />
                    </View>
                )}
            </View>
            {renderBottomSheet()}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    mainContent: {
        flex: 1,
    },
    carouselSection: {
        marginTop: 48,
    },
    carouselItem: {
        padding: 8,
    },
    carouselCover: {
        width: ITEM_WIDTH,
        height: 250,
        borderRadius: 16,
    },
    bookInfo: {
        marginTop: 8,
    },
    bookTitle: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    bookAuthor: {
        color: Colors.secondary,
        fontSize: 14,
        marginTop: 4,
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: BOTTOM_SHEET_HEIGHT,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    bottomSheetContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E0E0E0',
        alignSelf: 'center',
        marginVertical: 12,
    },
    bottomSheetScrollView: {
        flex: 1,
    },
    statsItem: {
        alignItems: 'center',
        gap: 0,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    statsText: {
        color: Colors.textBlack,
        fontSize: 16,
        fontWeight: '500',
    },
    statsTextLabel: {
        color: Colors.textGray,
        fontSize: 12,
        fontWeight: '600',
    },
    sectionTitle: {
        color: Colors.textBlack,
        fontSize: 20,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
    },
    summary: {
        color: Colors.textBlack,
        fontSize: 15,
        lineHeight: 24,
    },
    section: {
        marginBottom: 24,
    },
    bookItem: {
        marginRight: 16,
        width: 120,
    },
    bookLikeTitle: {
        color: Colors.textBlack,
        fontSize: 16,
        fontWeight: '500',
    },
    bookCover: {
        width: 120,
        height: 150,
        borderRadius: 16,
        marginBottom: 8,
    },
    readNowButton: {
        marginBottom: 24,
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    readNowButtonText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default BookDetails;
