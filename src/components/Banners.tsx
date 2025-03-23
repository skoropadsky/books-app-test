import { StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Carousel from 'react-native-snap-carousel';
import { Colors } from '../constants/Colors';

interface Slide {
    id: number;
    book_id: string;
    cover: string;
}

interface BannersProps {
    slides: Slide[];
}

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SLIDER_WIDTH;

const Banners: React.FC<BannersProps> = ({ slides }) => {
    const carouselRef = useRef<any>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (carouselRef.current && slides.length > 0) {
                const nextIndex = (activeSlide + 1) % slides.length;
                carouselRef.current.snapToItem(nextIndex);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [activeSlide, slides.length]);

    const renderSlide = ({ item }: { item: Slide }) => (
        <View style={styles.slideContainer}>
            <Image
                source={{ uri: item.cover }}
                style={styles.slideImage}
                resizeMode="cover"
            />
        </View>
    );

    const renderPagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeSlide && styles.paginationDotActive,
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                ref={carouselRef}
                data={slides}
                renderItem={({ item }: { item: any }) => renderSlide({ item: item as Slide })}
                sliderWidth={SLIDER_WIDTH}
                vertical={false}
                itemWidth={ITEM_WIDTH}
                onSnapToItem={setActiveSlide}
                loop={true}
                autoplay={false}
                layout="default"
                useScrollView={true}
                containerCustomStyle={styles.carousel}
                contentContainerCustomStyle={styles.carouselContent}
            />
            {renderPagination()}
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        height: 160,
        marginBottom: 16,
    },
    carousel: {
        flex: 1,
    },
    carouselContent: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    slideContainer: {
        width: SLIDER_WIDTH - 32,
        marginHorizontal: 'auto',
        height: '100%',
        borderRadius: 16,
    },
    slideImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.secondary,
        marginHorizontal: 4,
        opacity: 0.5,
    },
    paginationDotActive: {
        opacity: 1,
        backgroundColor: Colors.primary,
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});

export default Banners;
