# MindBridge App

A React Native mobile application designed to support cognitive wellness and sensory management for individuals with neurodivergent conditions.

## Features

### Authentication
- **Welcome Screen**: Initial landing page with Sign In and Sign Up options
- **Sign Up**: New user registration with email, password, and name
- **Sign In**: Existing user login with email and password
- **Sign Out**: Secure logout functionality

### Home Dashboard
- **Welcome Message**: Personalized greeting with user's name
- **Progress Tracking**: Today's progress metrics including:
  - Exercises Completed
  - Minutes Spent
  - Success Rate
- **Navigation Cards**: Access to core modules:
  - Cognitive Exercises
  - Sensory Management
  - Communication Tools (Coming Soon)
  - Emotion Recognition (Coming Soon)

### Cognitive Exercises
- **Task Breakdown**: Break down complex tasks into manageable steps
- **Step Management**: Add, remove, and track completion of individual steps
- **Progress Tracking**: Automatic progress updates to dashboard metrics

### Sensory Management
- **Tactile Comfort**: Checklist for managing tactile sensitivities
- **Comfort Strategies**: Three key strategies:
  - Use soft fabrics
  - Avoid irritating materials
  - Find comfortable clothing
- **Progress Persistence**: Save and sync checklist completion status

## Technical Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Authentication & Database)
- **Navigation**: React Navigation (Stack & Tab Navigation)
- **State Management**: React Hooks
- **Storage**: AsyncStorage for local session management

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindBridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Get your project URL and anon key
   - Update `lib/supabase.js` with your credentials:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

4. **Set up database tables**
   Run the following SQL in your Supabase SQL editor:

   ```sql
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

   -- Create policies
   CREATE POLICY "Users can view their own tasks" ON tasks
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own tasks" ON tasks
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can view their own task steps" ON task_steps
     FOR SELECT USING (task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid()));

   CREATE POLICY "Users can insert their own task steps" ON task_steps
     FOR INSERT WITH CHECK (task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid()));

   CREATE POLICY "Users can update their own task steps" ON task_steps
     FOR UPDATE USING (task_id IN (SELECT id FROM tasks WHERE user_id = auth.uid()));

   CREATE POLICY "Users can view their own progress" ON user_progress
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own progress" ON user_progress
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own progress" ON user_progress
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view their own tactile comfort items" ON tactile_comfort_items
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own tactile comfort items" ON tactile_comfort_items
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own tactile comfort items" ON tactile_comfort_items
     FOR UPDATE USING (auth.uid() = user_id);
   ```

5. **Run the app**
   ```bash
   npm start
   ```

6. **Test on device/simulator**
   - Install Expo Go on your mobile device
   - Scan the QR code from the terminal
   - Or press 'a' for Android simulator or 'i' for iOS simulator

## App Flow

### New User Registration
1. User opens app → Welcome Screen
2. Taps "Sign Up" → Sign Up Screen
3. Enters email, password, confirms password, and name
4. Taps "Register" → Account created via Supabase Auth
5. Success → Navigate to Home Screen with personalized welcome

### Existing User Login
1. User opens app → Welcome Screen
2. Taps "Sign In" → Sign In Screen
3. Enters email and password
4. Taps "Login" → Authenticated via Supabase Auth
5. Success → Navigate to Home Screen with personalized welcome

### Task Breakdown Flow
1. User navigates to Cognitive Exercises → Cognitive Exercises Screen
2. Taps "Task Breakdown" → Task Breakdown Detail Screen
3. Enters complex task title
4. Adds multiple steps using "Add Step" button
5. Taps "Save Task" → Saves to Supabase Database
6. Returns to Cognitive Exercises Screen

### Tactile Comfort Flow
1. User navigates to Sensory Management → Sensory Management Screen
2. Taps "Tactile Comfort" → Tactile Comfort Detail Screen
3. Taps checkboxes to mark strategies as complete/incomplete
4. Progress automatically saved to Supabase Database

## File Structure

```
MindBridge/
├── App.js                 # Main app component with navigation
├── lib/
│   └── supabase.js       # Supabase client configuration
├── screens/
│   ├── WelcomeScreen.js   # Welcome/Authentication screen
│   ├── SignUpScreen.js    # User registration screen
│   ├── SignInScreen.js    # User login screen
│   ├── HomeScreen.js      # Main dashboard
│   ├── CognitiveExercisesScreen.js  # Cognitive exercises list
│   ├── TaskBreakdownScreen.js       # Task breakdown detail
│   ├── SensoryManagementScreen.js   # Sensory management list
│   └── TactileComfortScreen.js      # Tactile comfort checklist
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. #   A p p  
 