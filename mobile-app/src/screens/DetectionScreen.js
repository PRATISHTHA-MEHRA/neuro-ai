import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getRemedy } from '../utils/api';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const DetectionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [percentage, setPercentage] = useState(null);
  const [remedy, setRemedy] = useState(null);

  useEffect(() => {
    if (route.params?.percentage) {
      setPercentage(parseInt(route.params.percentage));
    }
  }, [route.params]);

  useEffect(() => {
    if (percentage !== null) {
      getRemedy(percentage)
        .then((data) => {
          if (data && data.remedy) {
            setRemedy(data.remedy);
          }
        })
        .catch((error) => console.error('Error fetching remedy:', error));
    }
  }, [percentage]);

  const backToLearning = () => {
    navigation.navigate('Learning');
  };

  const backToTryAgain = () => {
    navigation.navigate('CourseTest');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phenome V and B</Text>
      </View>

      {/* Test Info */}
      <View style={styles.infoSection}>
        <Text style={styles.testNumber}>Test Number: 2</Text>
        <Text style={styles.detailsTitle}>Details about the test:</Text>
        
        <View style={styles.detailsGrid}>
          <Text style={styles.detailText}>Words to be spelled: Boat</Text>
          <Text style={styles.detailText}>Phenome word: Voat</Text>
          <Text style={styles.detailText}>
            Average correct percentage: {percentage}%
          </Text>
        </View>
      </View>

      {/* Analysis Result Header */}
      <View style={styles.analysisHeader}>
        <Text style={styles.analysisTitle}>Analysis Result</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBackground}>
          <Text style={styles.trophyIcon}>🏆</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${percentage}%` },
            ]}
          >
            <View style={styles.characterContainer}>
              <Text style={styles.characterIcon}>🐱</Text>
            </View>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>
      </View>

      {/* Model and Remedies Section */}
      {percentage <= 50 && (
        <View style={styles.remedySection}>
          <View style={styles.remedyHeader}>
            <Text style={styles.remedyTitle}>Model and Remedies</Text>
          </View>
          
          <View style={styles.remedyContent}>
            <Text style={styles.remedySubtitle}>
              Suggested improvements for Phoneme:
            </Text>
            {remedy && <Text style={styles.remedyText}>{remedy}</Text>}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={backToLearning}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Back to Learning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={backToTryAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.black,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  testNumber: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 12,
  },
  detailText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  analysisHeader: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.black,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  analysisTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  progressBackground: {
    position: 'relative',
    height: 200,
    backgroundColor: '#F0E5FF',
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 40,
    marginBottom: 16,
  },
  trophyIcon: {
    fontSize: 80,
  },
  progressBarContainer: {
    height: 48,
    backgroundColor: COLORS.purple,
    borderRadius: SIZES.smallRadius,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  characterContainer: {
    position: 'absolute',
    right: -20,
    top: -40,
  },
  characterIcon: {
    fontSize: 60,
  },
  percentageText: {
    color: COLORS.white,
    fontSize: SIZES.body1,
    fontWeight: 'bold',
  },
  remedySection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  remedyHeader: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.black,
    paddingVertical: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  remedyTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  remedyContent: {
    backgroundColor: COLORS.gray,
    padding: 20,
    borderRadius: SIZES.radius,
  },
  remedySubtitle: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  remedyText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: SIZES.smallRadius,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default DetectionScreen;
