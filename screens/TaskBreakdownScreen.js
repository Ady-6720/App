import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function TaskBreakdownScreen({ navigation }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [steps, setSteps] = useState(['']);
  const [loading, setLoading] = useState(false);

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const saveTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const validSteps = steps.filter(step => step.trim() !== '');
    if (validSteps.length === 0) {
      Alert.alert('Error', 'Please add at least one step');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Insert the task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskTitle.trim(),
        })
        .select()
        .single();

      if (taskError) {
        Alert.alert('Error', 'Failed to save task');
        return;
      }

      // Insert the steps
      const stepsToInsert = validSteps.map(stepText => ({
        task_id: taskData.id,
        step_text: stepText.trim(),
        is_completed: false,
      }));

      const { error: stepsError } = await supabase
        .from('task_steps')
        .insert(stepsToInsert);

      if (stepsError) {
        Alert.alert('Error', 'Failed to save steps');
        return;
      }

      Alert.alert(
        'Success',
        'Task saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Task Breakdown</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Complex Task</Text>
          <TextInput
            style={styles.taskInput}
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholder="Enter the complex task you want to break down"
            multiline
          />

          <Text style={styles.label}>Steps</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <TextInput
                style={styles.stepInput}
                value={step}
                onChangeText={(value) => updateStep(index, value)}
                placeholder={`Step ${index + 1}`}
              />
              {steps.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeStep(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addStepButton} onPress={addStep}>
            <Text style={styles.addStepText}>+ Add Step</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={saveTask}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Task'}
            </Text>
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
    gap: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  taskInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addStepButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  addStepText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
}); 