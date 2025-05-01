import { AppDataSource } from "../Infra/DBconnect/Connect"; // Adjust path if necessary

const resetSequence = async () => {
    try {
        await AppDataSource.initialize();
    console.log("✅ Database connection established!");

        // Query to reset the sequence for the 'user_auth' table's 'id' column
        await AppDataSource.query(`
            SELECT setval(pg_get_serial_sequence('user_auth', 'id'), COALESCE(MAX(id), 1) + 1, false) 
            FROM "user_auth";
        `);
        console.log("✅ User ID sequence reset successfully!");
    } catch (error) {
        console.error("❌ Error resetting sequence:", error);
    } finally {
        process.exit();
    }
};

// Execute the function
resetSequence();
