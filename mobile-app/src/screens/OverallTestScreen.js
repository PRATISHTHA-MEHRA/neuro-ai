import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Mic from '../components/Mic';
import RecordButton from '../components/RecordButton';
import NavButton from '../components/NavButton';
import RecordingLoader from '../components/RecordingLoader';
import { testWord, recordAudio } from '../utils/api';
import { COLORS, SIZES } from '../constants/theme';

const OverallTestScreen = () => {
  const navigation = useNavigation();
  const [letter, setLetter] = useState('A');
  const [attempts, setAttempts] = useState([]);
  const [word, setWord] = useState('Apple');
  const [pronunciation, setPronunciation] = useState('/appel/');
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [image, setImage] = useState('');
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        setAttempts([]);
        setAverageAccuracy(0);
        const data = await testWord(letter);
        setImage(data.image_link);
        setWord(data.word1);
        setPronunciation(data.pronunciation);
      } catch (error) {
        console.error('Error fetching word:', error);
      }
    };

    fetchWord();
  }, [letter]);

  useEffect(() => {
    let average = 0;
    for (let i = 0; i < attempts.length; i++) {
      average += attempts[i];
    }

    if (average === 0) {
      setAverageAccuracy(0);
    } else {
      setAverageAccuracy((average / attempts.length).toFixed(2));
    }
  }, [attempts]);

  const nextLetter = () => {
    setLetter((prevLetter) => {
      if (prevLetter === 'A') return 'B';
      if (prevLetter === 'B') return 'Z';
      return 'A';
    });
  };

  const previousLetter = () => {
    setLetter((prevLetter) => {
      if (prevLetter === 'A') return 'Z';
      if (prevLetter === 'Z') return 'B';
      return 'A';
    });
  };

  const recordButtonHandler = async () => {
    setRecording(true);
    try {
      const data = await recordAudio();
      setAttempts((prev) => [...prev, data.percentage]);
      setTimeout(() => {
        setRecording(false);
      }, 5000);
    } catch (error) {
      console.error('Error recording:', error);
      setRecording(false);
    }
  };

  const stopRecordHandler = () => {
    setRecording(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Info */}
        <Text style={styles.letterText}>Letter: {letter}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Word to be spelled: {word.charAt(0).toUpperCase() + word.slice(1)}
          </Text>
          <Text style={styles.infoText}>
            Average Correct Percentage - {attempts.length !== 0 ? averageAccuracy : 0}%
          </Text>
        </View>

        {/* Word Display */}
        <View style={styles.wordSection}>
          <Text style={styles.wordText}>{word}</Text>
          <Text style={styles.pronunciationText}>{pronunciation}</Text>
        </View>

        {/* Mic/Loader */}
        <View style={styles.micSection}>
          {!recording ? (
            <Mic onPress={recordButtonHandler} />
          ) : (
            <RecordingLoader />
          )}
        </View>

        {/* Attempts Display */}
        <View style={styles.attemptsSection}>
          <Text style={styles.attemptsTitle}>Attempts:</Text>
          <View style={styles.attemptsList}>
            {attempts.map((attempt, index) => (
              <View key={index} style={styles.attemptItem}>
                <Text style={styles.attemptText}>
                  Attempt {index + 1}: {attempt}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <NavButton text="Previous" onPress={previousLetter} />
          <NavButton text="Next" onPress={nextLetter} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {recording ? (
            <RecordButton
              bgColor={COLORS.red}
              text="Stop Recording"
              textColor={COLORS.white}
              onPress={stopRecordHandler}
            />
          ) : (
            <RecordButton
              bgColor={COLORS.secondary}
              text="Start Recording"
              textColor={COLORS.black}
              onPress={recordButtonHandler}
            />
          )}
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
  content: {
    padding: 20,
  },
  letterText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.black,
  },
  infoRow: {
    marginBottom: 20,
    gap: 8,
  },
  infoText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.black,
  },
  wordSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  pronunciationText: {
    fontSize: SIZES.h4,
    color: COLORS.darkGray,
  },
  micSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  attemptsSection: {
    marginVertical: 20,
  },
  attemptsTitle: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  attemptsList: {
    gap: 8,
  },
  attemptItem: {
    backgroundColor: COLORS.gray,
    padding: 12,
    borderRadius: SIZES.smallRadius,
  },
  attemptText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    fontWeight: '500',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
  },
  actionButtons: {
    alignItems: 'center',
    marginTop: 16,
  },
});

export default OverallTestScreen;
