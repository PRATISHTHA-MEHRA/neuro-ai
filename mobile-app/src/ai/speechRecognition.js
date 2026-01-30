import { RunAnywhere } from "@runanywhere/core";
import { Audio } from "expo-av";
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import runtimeManager from "./runtime";

class SpeechRecognitionService {
    constructor() {
        this.recording = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        console.log('Initializing speech recognition...');
        await runtimeManager.initialize();

        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
            throw new Error("Microphone permission not granted");
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        this.initialized = true;
        console.log("✅ Speech recognition initialized");
    }

    async startRecording() {
        await this.initialize();

        try {
            if (this.recording) {
                try {
                    await this.recording.stopAndUnloadAsync();
                } catch (e) {}
                this.recording = null;
            }

            const recording = new Audio.Recording();
            
            // Try to create WAV-compatible recording
            // Note: Android may still create 3GP despite these settings
            const recordingOptions = {
                isMeteringEnabled: true,
                android: {
                    extension: '.wav',
                    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
                    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 256000,
                },
                ios: {
                    extension: '.wav',
                    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
                    audioQuality: Audio.IOSAudioQuality.MAX,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 256000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: 'audio/wav',
                    bitsPerSecond: 256000,
                },
            };

            await recording.prepareToRecordAsync(recordingOptions);
            await recording.startAsync();
            
            this.recording = recording;
            console.log("✅ Recording started");
            return recording;
        } catch (error) {
            console.error("❌ Failed to start recording:", error);
            throw error;
        }
    }

    async stopRecordingAndTranscribe() {
        if (!this.recording) {
            throw new Error("No active recording");
        }

        let uri = null;
        
        try {
            console.log('Stopping recording...');
            await this.recording.stopAndUnloadAsync();
            uri = this.recording.getURI();
            this.recording = null;

            console.log("Recording URI:", uri);

            const fileInfo = await FileSystem.getInfoAsync(uri);
            console.log("File size:", fileInfo.size, "bytes");
            console.log("File extension:", uri.split('.').pop());

            if (!fileInfo.exists || fileInfo.size < 1000) {
                throw new Error("Recording file is too small or empty");
            }

            // Check if file is WAV format
            const extension = uri.split('.').pop().toLowerCase();
            if (extension !== 'wav') {
                console.warn(`⚠️ Audio file is ${extension}, not WAV. Whisper may not work.`);
            }

            let audioPath = uri;
            if (Platform.OS === 'android') {
                audioPath = uri.replace('file://', '');
            }

            console.log("Attempting transcription...");

            const result = await RunAnywhere.transcribeFile(audioPath, {
                language: 'en',
            });

            console.log("✅ Transcription successful:", result.text);
            return result.text.toLowerCase().trim();

        } catch (error) {
            console.error("❌ Transcription failed:", error.message);
            
            if (uri) {
                try {
                    await FileSystem.deleteAsync(uri, { idempotent: true });
                } catch (e) {}
            }
            
            // Throw error instead of faking transcription
            throw new Error("TRANSCRIPTION_FAILED: " + error.message);
        }
    }

    cleanup() {
        if (this.recording) {
            try {
                this.recording.stopAndUnloadAsync();
                this.recording = null;
            } catch (error) {}
        }
    }
}

export default new SpeechRecognitionService();
