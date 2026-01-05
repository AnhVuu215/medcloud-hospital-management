import { getConnection, closeConnection } from './src/config/database.js';

async function testConnection() {
    try {
        console.log('🔄 Testing database connection...');
        const pool = await getConnection();

        // Test query
        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log('✅ Database connection successful!');
        console.log('📊 SQL Server Version:', result.recordset[0].version);

        await closeConnection();
        console.log('✅ Connection closed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

testConnection();
