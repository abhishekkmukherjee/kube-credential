import sqlite3 from 'sqlite3';
import { Credential, IssuanceRecord } from './types';

export class Database {
  private db: sqlite3.Database;

  constructor(dbPath: string = './credentials.db') {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTable = `
      CREATE TABLE IF NOT EXISTS credentials (
        id TEXT PRIMARY KEY,
        credential_data TEXT NOT NULL,
        worker_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT DEFAULT 'issued'
      )
    `;
    
    this.db.run(createTable);
  }

  async saveCredential(record: IssuanceRecord): Promise<void> {
    const query = `
      INSERT INTO credentials (id, credential_data, worker_id, timestamp, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
      this.db.run(query, [
        record.id,
        JSON.stringify(record.credential),
        record.workerId,
        record.timestamp,
        record.status
      ], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async findCredential(credentialId: string): Promise<IssuanceRecord | null> {
    const query = 'SELECT * FROM credentials WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      this.db.get(query, [credentialId], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            credential: JSON.parse(row.credential_data),
            workerId: row.worker_id,
            timestamp: row.timestamp,
            status: row.status
          });
        }
      });
    });
  }

  async getAllCredentials(): Promise<IssuanceRecord[]> {
    const query = 'SELECT * FROM credentials ORDER BY timestamp DESC';
    
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const records = rows.map(row => ({
            id: row.id,
            credential: JSON.parse(row.credential_data),
            workerId: row.worker_id,
            timestamp: row.timestamp,
            status: row.status
          }));
          resolve(records);
        }
      });
    });
  }

  close(): void {
    this.db.close();
  }
}