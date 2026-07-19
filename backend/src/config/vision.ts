import vision from '@google-cloud/vision';

// Initialize the Google Cloud Vision client.
// This relies on the GOOGLE_APPLICATION_CREDENTIALS environment variable
// being set to the path of the service account JSON key file.
export const visionClient = new vision.ImageAnnotatorClient();
