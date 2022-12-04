import {SecretManagerServiceClient} from '@google-cloud/secret-manager'
import path from 'path'
import {GoogleAuth} from 'google-auth-library'

// interface SecretClientOptions {
//   authClient: Promise<GoogleAuth>
// }

class SecretClient {
  private client: SecretManagerServiceClient

  public constructor () {
    this.client = new SecretManagerServiceClient({
      projectId: 'budget-server-370616',
      keyFilename: path.resolve(__dirname, '../../credentials/budget-server-370616-89e345be95df.json')
    })
  }

  public async getSecret(secretName: string) {
    const [version] = await this.client.accessSecretVersion({
      name: secretName,
    });
  
    // Extract the payload as a string.
    return version.payload?.data?.toString()
  }
}

// const getSecretAuthClient = async () => {
//   const auth = new GoogleAuth({
//     scopes: 'https://www.googleapis.com/auth/cloud-platform'
//   });
//   const client = await auth.getClient();
//   const projectId = await auth.getProjectId();
//   const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
//   const res = await client.request({ url })
// }

const secretClient = new SecretClient()

export {
  SecretClient,
  secretClient
}