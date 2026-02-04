import { Client, ClientChannel } from 'ssh2';
import * as fs from 'fs';

export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  privateKey?: string;
  privateKeyPath?: string;
  password?: string;
}

export class SSHClient {
  private client: Client | null = null;
  private connected = false;

  async connect(config: SSHConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client();

      const sshConfig: any = {
        host: config.host,
        port: config.port,
        username: config.username,
      };

      if (config.privateKeyPath) {
        try {
          sshConfig.privateKey = fs.readFileSync(config.privateKeyPath);
        } catch (error) {
          return reject(new Error(`Failed to read private key: ${error}`));
        }
      } else if (config.privateKey) {
        sshConfig.privateKey = config.privateKey;
      } else if (config.password) {
        sshConfig.password = config.password;
      } else {
        return reject(new Error('No authentication method provided'));
      }

      this.client.on('ready', () => {
        this.connected = true;
        resolve();
      });

      this.client.on('error', (err) => {
        this.connected = false;
        reject(err);
      });

      this.client.connect(sshConfig);
    });
  }

  async exec(command: string, timeout = 10000): Promise<string> {
    if (!this.client || !this.connected) {
      throw new Error('SSH client not connected');
    }

    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        reject(new Error(`Command timeout after ${timeout}ms: ${command}`));
      }, timeout);

      this.client!.exec(command, (err, stream: ClientChannel) => {
        if (err) {
          clearTimeout(timeoutHandle);
          return reject(err);
        }

        let stdout = '';
        let stderr = '';

        stream.on('data', (data: Buffer) => {
          stdout += data.toString();
        });

        stream.stderr.on('data', (data: Buffer) => {
          stderr += data.toString();
        });

        stream.on('close', (code: number) => {
          clearTimeout(timeoutHandle);
          if (code !== 0) {
            reject(new Error(`Command failed with code ${code}: ${stderr}`));
          } else {
            resolve(stdout.trim());
          }
        });
      });
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.connected = false;
      this.client = null;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
