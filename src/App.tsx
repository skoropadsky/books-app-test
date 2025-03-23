import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import remoteConfig from '@react-native-firebase/remote-config';

import BookList from './screens/BookList';
import { Colors } from './constants/Colors';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [slides, setSlides] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await remoteConfig().setDefaults({
          json_data: JSON.stringify({ top_banner_slides: [] }),
        });

        await remoteConfig().fetchAndActivate();

        const jsonData = remoteConfig().getValue('json_data').asString();
        const parsedData = JSON.parse(jsonData);
        const slidesData = parsedData.top_banner_slides;
        const booksData = parsedData.books;

        setSlides(slidesData);
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching remote config:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
      </View>
      <BookList slides={slides} books={books} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
});

export default App;
