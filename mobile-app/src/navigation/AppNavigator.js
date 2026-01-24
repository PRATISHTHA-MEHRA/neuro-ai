import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LearningScreen from '../screens/LearningScreen';
import AboutScreen from '../screens/AboutScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import DetectionScreen from '../screens/DetectionScreen';
import OverallTestScreen from '../screens/OverallTestScreen';
import CourseTestScreen from '../screens/CourseTestScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main screens
const MainTabNavigator = ({ isAuthenticated, user, onLogin }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Articles') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Learning') {
            iconName = focused ? 'school' : 'school-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: COLORS.black,
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ 
          title: 'EduSync',
          headerShown: true,
        }}
      >
        {(props) => <HomeScreen {...props} isAuthenticated={isAuthenticated} user={user} onLogin={onLogin} />}
      </Tab.Screen>
      
      {isAuthenticated && (
        <Tab.Screen 
          name="Learning" 
          component={LearningScreen}
          options={{ 
            title: 'Learning',
          }}
        />
      )}
      
      <Tab.Screen 
        name="About" 
        component={AboutScreen}
        options={{ 
          title: 'About Us',
        }}
      />
      
      <Tab.Screen 
        name="Articles" 
        component={ArticlesScreen}
        options={{ 
          title: 'Articles',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const AppNavigator = ({ isAuthenticated, user, onLogin }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: COLORS.black,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        options={{ headerShown: false }}
      >
        {(props) => <MainTabNavigator {...props} isAuthenticated={isAuthenticated} user={user} onLogin={onLogin} />}
      </Stack.Screen>
      
      <Stack.Screen 
        name="Detection" 
        component={DetectionScreen}
        options={{ 
          title: 'Test Results',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen 
        name="OverallTest" 
        component={OverallTestScreen}
        options={{ 
          title: 'Overall Test',
          headerBackTitle: 'Back',
        }}
      />
      
      <Stack.Screen 
        name="CourseTest" 
        component={CourseTestScreen}
        options={{ 
          title: 'Course Test',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
