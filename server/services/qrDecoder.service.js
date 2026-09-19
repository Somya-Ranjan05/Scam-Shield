// server/services/qrDecoder.service.js
import sharp from "sharp";
import jsQR from "jsqr";

/**
 * Decodes a QR code image buffer server-side.
 * Returns the decoded text payload or null.
 */
export async function decodeQrBuffer(imageBuffer) {
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Ensure raw RGBA buffer
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);

    if (code && code.data) {
      return {
        payload: code.data,
        location: code.location,
      };
    }

    // Try again with image preprocessing (grayscale + normalize contrast) if initial pass failed
    const enhancedBuffer = await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const retryCode = jsQR(
      new Uint8ClampedArray(enhancedBuffer.data),
      enhancedBuffer.info.width,
      enhancedBuffer.info.height
    );

    if (retryCode && retryCode.data) {
      return {
        payload: retryCode.data,
        location: retryCode.location,
      };
    }

    return null;
  } catch (error) {
    console.error("QR decoding error:", error.message);
    throw new Error(`Failed to decode QR image: ${error.message}`);
  }
}
