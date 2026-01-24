import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import CourseModal from '../components/CourseModal';
import ArticlesComponent from '../components/ArticlesComponent';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const LearningScreen = () => {
  const navigation = useNavigation();

  const courses = [
    { phoneme1: 'V', phoneme2: 'B', status: 'Continue Learning', progress: 1, color: COLORS.primary },
    { phoneme1: 'P', phoneme2: 'F', status: 'Completed', progress: 4, color: COLORS.secondary },
    { phoneme1: 'T', phoneme2: 'D', status: 'Continue Learning', progress: 1, color: COLORS.primary },
    { phoneme1: 'S', phoneme2: 'Sh', status: 'Continue Learning', progress: 1, color: COLORS.primary },
    { phoneme1: 'F', phoneme2: 'Th', status: 'Continue Learning', progress: 1, color: COLORS.primary },
    { phoneme1: 'L', phoneme2: 'T', status: 'Continue Learning', progress: 1, color: COLORS.primary },
  ];

  const handleOverallTest = () => {
    navigation.navigate('OverallTest');
  };

  const handleCoursePress = () => {
    navigation.navigate('CourseTest');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Detection Test Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>
              Confused on how to get started?
            </Text>
            <Text style={styles.bannerSubtitle}>
              Don't worry take our detection of phoneme error test
            </Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={handleOverallTest}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerButtonText}>Start Test →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerImagePlaceholder}>
            <Text style={styles.bannerIcon}>🎯</Text>
          </View>
        </View>
      </View>

      {/* Calendar Section */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={{
            [new Date().toISOString().split('T')[0]]: {
              selected: true,
              selectedColor: COLORS.primary,
            },
          }}
          theme={{
            todayTextColor: COLORS.primary,
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: COLORS.white,
            arrowColor: COLORS.primary,
          }}
        />
      </View>

      {/* Phonemes Catalog Section */}
      <View style={styles.catalogSection}>
        <View style={styles.catalogHeader}>
          <Text style={styles.catalogTitle}>
            Correct your speech with Phonemes catalog
          </Text>
        </View>
        
        <ScrollView 
          style={styles.coursesList}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {courses.map((course, index) => (
            <CourseModal
              key={index}
              Phoneme1={course.phoneme1}
              Phoneme2={course.phoneme2}
              Status={course.status}
              Progress={course.progress}
              Color={course.color}
              onPress={handleCoursePress}
            />
          ))}
        </ScrollView>
      </View>

      {/* Articles Section */}
      <View style={styles.articlesSection}>
        <View style={styles.articlesHeader}>
          <Text style={styles.articlesTitle}>Recent Articles</Text>
        </View>
        
        <View style={styles.articlesContainer}>
          <ArticlesComponent />
          <ArticlesComponent />
          <ArticlesComponent />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerContainer: {
    padding: 20,
    paddingTop: 10,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#B3E5FC',
    borderRadius: SIZES.radius,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    marginBottom: 16,
    fontWeight: '600',
  },
  bannerButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SIZES.smallRadius,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerButtonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  bannerImagePlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  bannerIcon: {
    fontSize: 60,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  catalogSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  catalogHeader: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.black,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  catalogTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  coursesList: {
    maxHeight: 500,
  },
  articlesSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  articlesHeader: {
    marginBottom: 16,
  },
  articlesTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  articlesContainer: {
    gap: 16,
  },
});

export default LearningScreen;
