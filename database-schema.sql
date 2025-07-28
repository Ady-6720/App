-- MindBridge Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_steps table
CREATE TABLE task_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  step_text TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  exercises_completed INTEGER DEFAULT 0,
  minutes_spent INTEGER DEFAULT 0,
  success_rate FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create tactile_comfort_items table
CREATE TABLE tactile_comfort_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tactile_comfort_items ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for task_steps
CREATE POLICY "Users can view their own task steps" ON task_steps
  FOR SELECT USING (task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own task steps" ON task_steps
  FOR INSERT WITH CHECK (task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own task steps" ON task_steps
  FOR UPDATE USING (task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own task steps" ON task_steps
  FOR DELETE USING (task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid()));

-- Create policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for tactile_comfort_items
CREATE POLICY "Users can view their own tactile comfort items" ON tactile_comfort_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tactile comfort items" ON tactile_comfort_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tactile comfort items" ON tactile_comfort_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tactile comfort items" ON tactile_comfort_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_task_steps_task_id ON task_steps(task_id);
CREATE INDEX idx_user_progress_user_id_date ON user_progress(user_id, date);
CREATE INDEX idx_tactile_comfort_items_user_id ON tactile_comfort_items(user_id); 