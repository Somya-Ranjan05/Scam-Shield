// server/middleware/uploadHandler.middleware.js
import multer from "multer";

const storage = multer.memoryStorage();

const ALLOWED_IMAGE_MIMES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ALLOWED_AUDIO_MIMES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/x-m4a",
  "audio/webm",
  "audio/aac",
];

export const uploadQrImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_MIMES.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("INVALID_FILE_TYPE: Only PNG, JPEG, and WebP images are supported for QR codes."));
    }
  },
}).single("qr_image");

export const uploadVoiceAudio = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_AUDIO_MIMES.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("INVALID_FILE_TYPE: Only MP3, WAV, MP4/M4A, OGG, and WebM audio files are accepted."));
    }
  },
}).single("audio_file");
