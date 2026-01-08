import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    database: process.env.DB_DATABASE || 'MedCloudDB',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
    },
    pool: {
        max: 5, // Reduced for development
        min: 2, // Keep minimum connections ready
        idleTimeoutMillis: 30000,
    },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
    try {
        if (pool) {
            return pool;
        }

        pool = await sql.connect(config);
        console.log('✅ Connected to SQL Server database');
        return pool;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}

export async function closeConnection(): Promise<void> {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('✅ Database connection closed');
        }
    } catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw error;
    }
}

export { sql };
