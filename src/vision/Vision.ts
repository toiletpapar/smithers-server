import vision, { ImageAnnotatorClient } from '@google-cloud/vision'

// Creates a client
class ImageClient {
  private client: ImageAnnotatorClient
  private static imageClient: Promise<ImageClient>

  public static getInstance(): Promise<ImageClient> {
    if (!ImageClient.imageClient) {
      ImageClient.imageClient = Promise.resolve(new ImageClient())
    }

    return ImageClient.imageClient
  }

  public constructor () {
    this.client = new vision.ImageAnnotatorClient()
  }

  // image - a base64 encoded string of the image
  public textDetection(image: string) {
    return this.client.textDetection({
      image: {
        content: image
      }
    })
  }
}

export {
  ImageClient
}