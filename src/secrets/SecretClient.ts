import {SecretManagerServiceClient} from '@google-cloud/secret-manager'

class SecretClient {
  private client: SecretManagerServiceClient

  public constructor () {
    this.client = new SecretManagerServiceClient({})
  }

  public async getSecret(secretName: string) {
    const [version] = await this.client.accessSecretVersion({
      name: `projects/593265247388/secrets/${secretName}/versions/latest`,
    });
  
    // Extract the payload as a string.
    return version.payload?.data?.toString()
  }
}

const secretClient = new SecretClient()

export {
  SecretClient,
  secretClient
}