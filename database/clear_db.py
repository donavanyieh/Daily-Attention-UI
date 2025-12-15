import sqlite3
import os

def clear_database():
    """Clear all papers from the database while preserving table structure"""
    
    # Get database path (one level up from this script)
    db_path = os.path.join(os.path.dirname(__file__), '..', 'papers.db')
    
    # Check if database exists
    if not os.path.exists(db_path):
        print("❌ Database file 'papers.db' not found!")
        print(f"   Expected path: {os.path.abspath(db_path)}")
        return
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if papers table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='papers'")
    if not cursor.fetchone():
        print("❌ Table 'papers' not found in database!")
        conn.close()
        return
    
    # Get count before deletion
    cursor.execute('SELECT COUNT(*) FROM papers')
    count_before = cursor.fetchone()[0]
    
    if count_before == 0:
        print("ℹ️  Database is already empty. No papers to delete.")
        conn.close()
        return
    
    # Delete all records from papers table
    cursor.execute('DELETE FROM papers')
    conn.commit()
    
    # Verify deletion
    cursor.execute('SELECT COUNT(*) FROM papers')
    count_after = cursor.fetchone()[0]
    
    print(f"✅ Database cleared successfully!")
    print(f"✅ Deleted {count_before} papers from 'papers' table")
    print(f"✅ Current count: {count_after} papers")
    print("\nℹ️  Table structure has been preserved.")
    print("   Run 'python database/init_db.py' to repopulate with mock data.")
    
    conn.close()

if __name__ == "__main__":
    clear_database()
