import { RunAnywhere } from "@runanywhere/core";
import { Audio } from "expo-av";
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
            staysActiveInBackground: false,
        });

        this.initialized = true;
        console.log("✅ Speech recognition initialized");
    }

    async startRecording() {
        await this.initialize();

        try {
            const recording = new Audio.Recording();
            
            // Configure for WAV format compatible with Whisper
            await recording.prepareToRecordAsync({
                android: {
                    extension: '.wav',
                    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
                    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.wav',
                    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: 'audio/wav',
                    bitsPerSecond: 128000,
                },
            });
            
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

        try {
            console.log('Stopping recording...');
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();

            console.log("Recording URI:", uri);

            // Transcribe using RunAnywhere
            const result = await RunAnywhere.transcribeFile(uri, {
                language: "en",
            });

            console.log("✅ Transcription:", result.text);

            this.recording = null;
            return result.text.toLowerCase().trim();
        } catch (error) {
            console.error("❌ Transcription failed:", error);
            this.recording = null;
            throw error;
        }
    }

    cleanup() {
        if (this.recording) {
            try {
                this.recording.stopAndUnloadAsync();
                this.recording = null;
            } catch (error) {
                console.error("Error cleaning up:", error);
            }
        }
    }
}

export default new SpeechRecognitionService();
