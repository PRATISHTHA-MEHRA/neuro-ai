const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

// POST /api/transcribe
router.post('/', async (req, res) => {
    try {
        const { audio, format } = req.body;

        if (!audio) {
            return res.status(400).json({ error: 'No audio data provided' });
        }

        // Save base64 audio to temp file
        const tempDir = os.tmpdir();
        const tempInputPath = path.join(tempDir, `input_${Date.now()}.${format || 'mp4'}`);
        const tempOutputPath = path.join(tempDir, `output_${Date.now()}.wav`);

        // Decode base64 and save
        const audioBuffer = Buffer.from(audio, 'base64');
        fs.writeFileSync(tempInputPath, audioBuffer);

        // Convert to WAV using ffmpeg (if available)
        try {
            await new Promise((resolve, reject) => {
                exec(
                    `ffmpeg -i "${tempInputPath}" -acodec pcm_s16le -ar 16000 -ac 1 "${tempOutputPath}" -y`,
                    (error, stdout, stderr) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            });

            // Here you would use a transcription service like:
            // - OpenAI Whisper API
            // - Google Speech-to-Text
            // - Azure Speech Services
            // For now, return a placeholder

            // Clean up temp files
            fs.unlinkSync(tempInputPath);
            if (fs.existsSync(tempOutputPath)) {
                fs.unlinkSync(tempOutputPath);
            }

            // Return placeholder (replace with actual transcription)
            res.json({
                transcription: "audio transcription not implemented on server",
                success: false,
                message: "Server-side transcription requires Whisper API integration"
            });

        } catch (ffmpegError) {
            console.error('FFmpeg error:', ffmpegError);
            
            // Clean up
            if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
            if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);

            res.status(500).json({ 
                error: 'Audio conversion failed',
                message: ffmpegError.message 
            });
        }

    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ error: 'Transcription failed' });
    }
});

module.exports = router;
