import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function TactileComfortScreen({ navigation }) {
  const [items, setItems] = useState([
    { id: 1, text: 'Use soft fabrics', completed: false },
    { id: 2, text: 'Avoid irritating materials', completed: false },
    { id: 3, text: 'Find comfortable clothing', completed: false },
  ]);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: savedItems } = await supabase
        .from('tactile_comfort_items')
        .select('*')
        .eq('user_id', user.id);

      if (savedItems) {
        const updatedItems = items.map(item => {
          const savedItem = savedItems.find(saved => saved.item_text === item.text);
          return {
            ...item,
            completed: savedItem ? savedItem.is_completed : false,
          };
        });
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const toggleItem = async (index) => {
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const item = newItems[index];

      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('tactile_comfort_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_text', item.text)
        .single();

      if (existingItem) {
        // Update existing item
        await supabase
          .from('tactile_comfort_items')
          .update({ is_completed: item.completed })
          .eq('id', existingItem.id);
      } else {
        // Insert new item
        await supabase
          .from('tactile_comfort_items')
          .insert({
            user_id: user.id,
            item_text: item.text,
            is_completed: item.completed,
          });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      Alert.alert('Error', 'Failed to save progress');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tactile Comfort</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Check off the strategies that work best for your tactile sensitivities:
          </Text>

          <View style={styles.checklist}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleItem(index)}
              >
                <View style={[
                  styles.checkbox,
                  item.completed && styles.checkboxCompleted
                ]}>
                  {item.completed && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={[
                  styles.itemText,
                  item.completed && styles.itemTextCompleted
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 24,
    marginBottom: 30,
  },
  checklist: {
    gap: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
}); 