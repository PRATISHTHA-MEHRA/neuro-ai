import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const CourseModal = ({ Phoneme1, Phoneme2, Status, Color, Progress, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={[styles.imageContainer, { backgroundColor: COLORS.purple }]}>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📚</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.infoSection}>
            <View>
              <Text style={styles.phonemeText}>
                Phoneme {Phoneme1} and {Phoneme2}
              </Text>
              <Text style={styles.progressLabel}>Progress</Text>
            </View>
            <View>
              <Text style={styles.testText}>Tests: {Progress} / 4</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: Color }]}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{Status} →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: SIZES.radius,
    marginVertical: 8,
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    padding: 16,
    borderRadius: SIZES.radius,
    marginRight: 16,
  },
  placeholder: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  phonemeText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
  },
  testText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SIZES.smallRadius,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.body3,
    fontWeight: '600',
  },
});

export default CourseModal;
