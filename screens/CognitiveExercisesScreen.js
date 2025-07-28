import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

export default function CognitiveExercisesScreen({ navigation }) {
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
          <Text style={styles.title}>Cognitive Exercises</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.infoText}>
            Take your time and progress at your own pace. These exercises are designed to help improve your cognitive skills and focus.
          </Text>

          <View style={styles.exercisesList}>
            <TouchableOpacity
              style={styles.exerciseCard}
              onPress={() => navigation.navigate('TaskBreakdown')}
            >
              <Text style={styles.exerciseTitle}>Task Breakdown</Text>
              <Text style={styles.exerciseDescription}>
                Break down complex tasks into manageable steps to improve organization and reduce overwhelm.
              </Text>
            </TouchableOpacity>
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
  infoText: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  exercisesList: {
    gap: 16,
  },
  exerciseCard: {
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
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
}); 