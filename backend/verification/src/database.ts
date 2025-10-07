import sqlite3 from 'sqlite3';
import { VerificationRecord } from './types';

export class Database {
  private db: sqlite3.Database;

  constructor(dbPath: string = './verifications.db') {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTable = `
      CREATE TABLE IF NOT EXISTS verifications (
        id TEXT PRIMARY KEY,
        credential_id TEXT NOT NULL,
        worker_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        verification_result TEXT NOT NULL,
        issuance_worker_id TEXT,
        issuance_timestamp TEXT
      )
    `;
    
    this.db.run(createTable);
  }

  async saveVerification(record: VerificationRecord): Promise<void> {
    const query = `
      INSERT INTO verifications (id, credential_id, worker_id, timestamp, verification_result, issuance_worker_id, issuance_timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
      this.db.run(query, [
        record.id,
        record.credentialId,
        record.workerId,
        record.timestamp,
        record.verificationResult,
        record.issuanceWorkerId,
        record.issuanceTimestamp
      ], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async getVerificationHistory(credentialId: string): Promise<VerificationRecord[]> {
    const query = 'SELECT * FROM verifications WHERE credential_id = ? ORDER BY timestamp DESC';
    
    return new Promise((resolve, reject) => {
      this.db.all(query, [credentialId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const records = rows.map(row => ({
            id: row.id,
            credentialId: row.credential_id,
            workerId: row.worker_id,
            timestamp: row.timestamp,
            verificationResult: row.verification_result,
            issuanceWorkerId: row.issuance_worker_id,
            issuanceTimestamp: row.issuance_timestamp
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