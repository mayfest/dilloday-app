import React, { useState } from 'react';

import FAQCategorySection from '@/components/faq/faq-category-section';
import SearchBar from '@/components/faq/faq-search-bar';
import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { FAQ_DATA } from '@/constants/faq';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FAQScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(FAQ_DATA);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredData(FAQ_DATA);
      return;
    }

    const lowercaseQuery = query.toLowerCase();

    const filtered = FAQ_DATA.map((category) => {
      const filteredItems = category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.content.some((paragraph) =>
            paragraph.toLowerCase().includes(lowercaseQuery)
          )
      );

      return {
        ...category,
        items: filteredItems,
      };
    }).filter((category) => category.items.length > 0);

    setFilteredData(filtered);
  };

  return (
    <StackScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <SearchBar onSearch={handleSearch} value={searchQuery} />

        {filteredData.length > 0 ? (
          filteredData.map((category, index) => (
            <FAQCategorySection
              key={index}
              category={category.category}
              items={category.items}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No results found for "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
    color: Colors.light.text,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
