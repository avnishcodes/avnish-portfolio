/**
 * Audio processing utilities for Gemini Live API
 * - Input: 16kHz Mono 16-bit PCM Little Endian
 * - Output: 24kHz Mono 16-bit PCM Little Endian playback
 */

// Convert Float32Array channel data from Web Audio to 16-bit Linear PCM Base64 string
export function floatTo16BitPCMBase64(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    // 16-bit signed integer range: -32768 to 32767
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 16-bit PCM data from Gemini Live to an AudioBuffer for 24kHz playback
export function pcmBase64ToAudioBuffer(
  base64Data: string,
  audioCtx: AudioContext,
  sampleRate: number = 24000
): AudioBuffer {
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const dataView = new DataView(bytes.buffer);
  const numSamples = Math.floor(len / 2);
  const audioBuffer = audioCtx.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    // Normalize to [-1.0, 1.0]
    channelData[i] = int16 < 0 ? int16 / 32768 : int16 / 32767;
  }

  return audioBuffer;
}
