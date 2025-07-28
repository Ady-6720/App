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

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    exercisesCompleted: 0,
    minutesSpent: 0,
    successRate: 0,
  });

  useEffect(() => {
    fetchUserData();
    fetchTodayProgress();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTodayProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's progress from user_progress table
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (progressData) {
        setProgress({
          exercisesCompleted: progressData.exercises_completed || 0,
          minutesSpent: progressData.minutes_spent || 0,
          successRate: progressData.success_rate || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error', 'Failed to sign out');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleCardPress = (cardName) => {
    switch (cardName) {
      case 'cognitive':
        navigation.navigate('CognitiveExercises');
        break;
      case 'sensory':
        navigation.navigate('SensoryManagement');
        break;
      case 'communication':
        Alert.alert('Coming Soon', 'Communication Tools will be available in a future update.');
        break;
      case 'emotion':
        Alert.alert('Coming Soon', 'Emotion Recognition will be available in a future update.');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.user_metadata?.name || 'User'}
          </Text>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressGrid}>
            <View style={styles.progressCard}>
              <Text style={styles.progressNumber}>{progress.exercisesCompleted}</Text>
              <Text style={styles.progressLabel}>Exercises Completed</Text>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressNumber}>{progress.minutesSpent}</Text>
              <Text style={styles.progressLabel}>Minutes Spent</Text>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressNumber}>{progress.successRate}%</Text>
              <Text style={styles.progressLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardsSection}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress('cognitive')}
          >
            <Text style={styles.cardTitle}>Cognitive Exercises</Text>
            <Text style={styles.cardDescription}>
              Improve focus and cognitive skills through structured exercises
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress('sensory')}
          >
            <Text style={styles.cardTitle}>Sensory Management</Text>
            <Text style={styles.cardDescription}>
              Manage sensory sensitivities and find comfort strategies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.disabledCard]}
            onPress={() => handleCardPress('communication')}
          >
            <Text style={styles.cardTitle}>Communication Tools</Text>
            <Text style={styles.cardDescription}>
              Enhance communication skills and social interactions
            </Text>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.disabledCard]}
            onPress={() => handleCardPress('emotion')}
          >
            <Text style={styles.cardTitle}>Emotion Recognition</Text>
            <Text style={styles.cardDescription}>
              Learn to identify and understand emotions better
            </Text>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signOutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  cardsSection: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledCard: {
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  comingSoon: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 8,
  },
}); 