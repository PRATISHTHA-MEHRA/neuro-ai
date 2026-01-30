import { PermissionsAndroid, Platform } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import * as FileSystem from "expo-file-system";
import runtimeManager from "./runtime";

class SpeechRecognitionService {
    constructor() {
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.initialized = false;
        this.isRecording = false;
        this.recordPath = null;
    }

    async initialize() {
        if (this.initialized) return;

        console.log("Initializing speech recognition...");
        await runtimeManager.initialize();

        if (Platform.OS === "android") {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

                if (
                    grants["android.permission.RECORD_AUDIO"] !==
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    throw new Error("Microphone permission not granted");
                }
                console.log("✅ Permissions granted");
            } catch (err) {
                console.error("Permission error:", err);
                throw new Error("Failed to get permissions");
            }
        }

        this.initialized = true;
        console.log("✅ Speech recognition initialized");
    }

    async startRecording() {
        await this.initialize();

        try {
            if (this.isRecording) {
                try {
                    await this.audioRecorderPlayer.stopRecorder();
                } catch (e) {}
                this.isRecording = false;
            }

            const timestamp = Date.now();
            const fileName = `recording_${timestamp}.mp4`;
            this.recordPath = `${FileSystem.cacheDirectory}${fileName}`;
            
            const recorderPath = this.recordPath.replace("file://", "");
            console.log("Starting recording to:", recorderPath);

            const uri = await this.audioRecorderPlayer.startRecorder(recorderPath);

            this.isRecording = true;
            console.log("✅ Recording started:", uri);

            this.audioRecorderPlayer.addRecordBackListener((e) => {
                return;
            });

            return uri;
        } catch (error) {
            console.error("❌ Failed to start recording:", error);
            this.isRecording = false;
            throw error;
        }
    }

    async stopRecording() {
        if (!this.isRecording) {
            throw new Error("No active recording");
        }

        try {
            console.log("Stopping recording...");

            const result = await this.audioRecorderPlayer.stopRecorder();
            this.audioRecorderPlayer.removeRecordBackListener();
            this.isRecording = false;

            console.log("✅ Recording stopped:", result);

            // Clean up the file
            if (this.recordPath) {
                try {
                    const fileUri = this.recordPath.startsWith("file://")
                        ? this.recordPath
                        : `file://${this.recordPath}`;
                    await FileSystem.deleteAsync(fileUri, { idempotent: true });
                } catch (e) {}
            }

            return result;
        } catch (error) {
            console.error("❌ Stop recording failed:", error);
            this.isRecording = false;
            throw error;
        }
    }

    async cleanup() {
        try {
            if (this.isRecording) {
                await this.audioRecorderPlayer.stopRecorder();
                this.audioRecorderPlayer.removeRecordBackListener();
                this.isRecording = false;
            }
        } catch (error) {
            console.error("Error cleaning up:", error);
        }
    }
}

export default new SpeechRecognitionService();
