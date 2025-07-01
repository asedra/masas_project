import psycopg2
from psycopg2 import Error
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import DB_CONFIG, DATABASE_URL
import json
from typing import Dict, List, Any

class DatabaseConnection:
    def __init__(self):
        self.connection = None
        self.engine = None
        self.SessionLocal = None
    
    def connect_psycopg2(self):
        """Psycopg2 ile doğrudan bağlantı"""
        try:
            self.connection = psycopg2.connect(**DB_CONFIG)
            print("✅ PostgreSQL veritabanına başarıyla bağlandı (psycopg2)")
            return self.connection
        except Error as e:
            print(f"❌ Bağlantı hatası: {e}")
            return None
    
    def connect_sqlalchemy(self):
        """SQLAlchemy ile bağlantı"""
        try:
            self.engine = create_engine(DATABASE_URL)
            self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
            print("✅ PostgreSQL veritabanına başarıyla bağlandı (SQLAlchemy)")
            return self.engine
        except Exception as e:
            print(f"❌ SQLAlchemy bağlantı hatası: {e}")
            return None
    
    def test_connection(self):
        """Bağlantıyı test et"""
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text("SELECT version();"))
                version = result.fetchone()
                print(f"📊 PostgreSQL Versiyonu: {version[0]}")
                return True
        except Exception as e:
            print(f"❌ Test bağlantısı hatası: {e}")
            return False
    
    def get_database_schema(self) -> Dict[str, Any]:
        """
        Tüm veritabanı şemasını çeker ve arayüz için uygun formatta döner
        """
        if not self.engine:
            print("❌ Veritabanı bağlantısı yok")
            return {}
        
        schema_data = {
            "schemas": [],
            "tables": [],
            "columns": [],
            "relationships": [],
            "constraints": [],
            "indexes": [],
            "functions": [],
            "triggers": []
        }
        
        try:
            with self.engine.connect() as connection:
                # 1. Şemaları çek
                schema_query = """
                SELECT 
                    schema_name,
                    schema_owner
                FROM information_schema.schemata 
                WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                ORDER BY schema_name;
                """
                
                schemas = connection.execute(text(schema_query))
                for schema in schemas:
                    schema_data["schemas"].append({
                        "name": schema[0],
                        "owner": schema[1]
                    })
                
                # 2. Tabloları çek
                table_query = """
                SELECT 
                    t.table_schema,
                    t.table_name,
                    t.table_type,
                    t.is_insertable_into,
                    obj_description(
                        (t.table_schema || '.' || t.table_name)::regclass, 'pg_class'
                    ) as table_comment
                FROM information_schema.tables t
                WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                ORDER BY t.table_schema, t.table_name;
                """
                
                tables = connection.execute(text(table_query))
                for table in tables:
                    schema_data["tables"].append({
                        "schema": table[0],
                        "name": table[1],
                        "type": table[2],
                        "is_insertable": table[3],
                        "comment": table[4]
                    })
                
                # 3. Sütunları çek
                column_query = """
                SELECT 
                    c.table_schema,
                    c.table_name,
                    c.column_name,
                    c.ordinal_position,
                    c.column_default,
                    c.is_nullable,
                    c.data_type,
                    c.character_maximum_length,
                    c.numeric_precision,
                    c.numeric_scale,
                    c.datetime_precision,
                    col_description(
                        (c.table_schema || '.' || c.table_name)::regclass, c.ordinal_position
                    ) as column_comment
                FROM information_schema.columns c
                WHERE c.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                ORDER BY c.table_schema, c.table_name, c.ordinal_position;
                """
                
                columns = connection.execute(text(column_query))
                for column in columns:
                    schema_data["columns"].append({
                        "schema": column[0],
                        "table": column[1],
                        "name": column[2],
                        "position": column[3],
                        "default_value": column[4],
                        "is_nullable": column[5],
                        "data_type": column[6],
                        "max_length": column[7],
                        "numeric_precision": column[8],
                        "numeric_scale": column[9],
                        "datetime_precision": column[10],
                        "comment": column[11]
                    })
                
                # 4. İlişkileri (Foreign Keys) çek
                fk_query = """
                SELECT 
                    tc.table_schema,
                    tc.table_name,
                    tc.constraint_name,
                    kcu.column_name,
                    ccu.table_schema AS foreign_table_schema,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name,
                    rc.update_rule,
                    rc.delete_rule
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                    AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage ccu
                    ON ccu.constraint_name = tc.constraint_name
                    AND ccu.table_schema = tc.table_schema
                JOIN information_schema.referential_constraints rc
                    ON tc.constraint_name = rc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                    AND tc.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                ORDER BY tc.table_schema, tc.table_name, kcu.ordinal_position;
                """
                
                foreign_keys = connection.execute(text(fk_query))
                for fk in foreign_keys:
                    schema_data["relationships"].append({
                        "schema": fk[0],
                        "table": fk[1],
                        "constraint_name": fk[2],
                        "column": fk[3],
                        "foreign_schema": fk[4],
                        "foreign_table": fk[5],
                        "foreign_column": fk[6],
                        "update_rule": fk[7],
                        "delete_rule": fk[8]
                    })
                
                # 5. Kısıtlamaları çek (Primary Keys, Unique, Check)
                constraint_query = """
                SELECT 
                    tc.table_schema,
                    tc.table_name,
                    tc.constraint_name,
                    tc.constraint_type,
                    kcu.column_name,
                    cc.check_clause
                FROM information_schema.table_constraints tc
                LEFT JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                    AND tc.table_schema = kcu.table_schema
                LEFT JOIN information_schema.check_constraints cc
                    ON tc.constraint_name = cc.constraint_name
                WHERE tc.table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                    AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE', 'CHECK')
                ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;
                """
                
                constraints = connection.execute(text(constraint_query))
                for constraint in constraints:
                    schema_data["constraints"].append({
                        "schema": constraint[0],
                        "table": constraint[1],
                        "name": constraint[2],
                        "type": constraint[3],
                        "column": constraint[4],
                        "check_clause": constraint[5]
                    })
                
                # 6. İndeksleri çek
                index_query = """
                SELECT 
                    schemaname,
                    tablename,
                    indexname,
                    indexdef
                FROM pg_indexes
                WHERE schemaname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                ORDER BY schemaname, tablename, indexname;
                """
                
                indexes = connection.execute(text(index_query))
                for index in indexes:
                    schema_data["indexes"].append({
                        "schema": index[0],
                        "table": index[1],
                        "name": index[2],
                        "definition": index[3]
                    })
                
                # 7. Fonksiyonları çek
                function_query = """
                SELECT 
                    n.nspname as schema_name,
                    p.proname as function_name,
                    pg_get_function_arguments(p.oid) as arguments,
                    pg_get_function_result(p.oid) as return_type,
                    p.prosrc as source_code
                FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                ORDER BY n.nspname, p.proname;
                """
                
                functions = connection.execute(text(function_query))
                for func in functions:
                    schema_data["functions"].append({
                        "schema": func[0],
                        "name": func[1],
                        "arguments": func[2],
                        "return_type": func[3],
                        "source_code": func[4]
                    })
                
                # 8. Tetikleyicileri çek
                trigger_query = """
                SELECT 
                    trigger_schema,
                    trigger_name,
                    event_manipulation,
                    event_object_schema,
                    event_object_table,
                    action_statement,
                    action_timing
                FROM information_schema.triggers
                WHERE trigger_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                ORDER BY trigger_schema, trigger_name;
                """
                
                triggers = connection.execute(text(trigger_query))
                for trigger in triggers:
                    schema_data["triggers"].append({
                        "schema": trigger[0],
                        "name": trigger[1],
                        "event": trigger[2],
                        "object_schema": trigger[3],
                        "object_table": trigger[4],
                        "action": trigger[5],
                        "timing": trigger[6]
                    })
                
                print(f"✅ Şema bilgileri başarıyla çekildi:")
                print(f"   📊 {len(schema_data['schemas'])} şema")
                print(f"   📋 {len(schema_data['tables'])} tablo")
                print(f"   📝 {len(schema_data['columns'])} sütun")
                print(f"   🔗 {len(schema_data['relationships'])} ilişki")
                print(f"   🔒 {len(schema_data['constraints'])} kısıtlama")
                print(f"   📈 {len(schema_data['indexes'])} indeks")
                print(f"   ⚙️ {len(schema_data['functions'])} fonksiyon")
                print(f"   🚀 {len(schema_data['triggers'])} tetikleyici")
                
                return schema_data
                
        except Exception as e:
            print(f"❌ Şema çekme hatası: {e}")
            return {}
    
    def save_schema_to_file(self, filename: str = "database_schema.json"):
        """Şema bilgilerini JSON dosyasına kaydet"""
        schema_data = self.get_database_schema()
        if schema_data:
            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(schema_data, f, ensure_ascii=False, indent=2)
                print(f"✅ Şema bilgileri {filename} dosyasına kaydedildi")
                return True
            except Exception as e:
                print(f"❌ Dosya kaydetme hatası: {e}")
                return False
        return False
    
    def close_connection(self):
        """Bağlantıyı kapat"""
        if self.connection:
            self.connection.close()
            print("🔌 Psycopg2 bağlantısı kapatıldı")
        
        if self.engine:
            self.engine.dispose()
            print("🔌 SQLAlchemy bağlantısı kapatıldı")

    def add_missing_timestamps_to_customers(self):
        """customers tablosuna created_at ve updated_at kolonlarını ekle"""
        alter_sql = '''
        ALTER TABLE customers
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
        '''
        try:
            with self.engine.connect() as connection:
                connection.execute(text(alter_sql))
                print("✅ customers tablosuna created_at ve updated_at eklendi (veya zaten vardı)")
        except Exception as e:
            print(f"❌ Kolon ekleme hatası: {e}")

def get_db_session():
    """Database session factory"""
    db = DatabaseConnection()
    engine = db.connect_sqlalchemy()
    if engine:
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        return SessionLocal()
    return None

# Kullanım örneği
if __name__ == "__main__":
    db = DatabaseConnection()
    
    # Psycopg2 bağlantısı
    print("🔌 Psycopg2 ile bağlanıyor...")
    db.connect_psycopg2()
    
    # SQLAlchemy bağlantısı
    print("\n🔌 SQLAlchemy ile bağlanıyor...")
    db.connect_sqlalchemy()
    
    # Bağlantı testi
    if db.engine:
        print("\n🧪 Bağlantı testi yapılıyor...")
        db.test_connection()
        
        # Şema bilgilerini çek ve kaydet
        print("\n📊 Veritabanı şeması çekiliyor...")
        db.save_schema_to_file()
    
    # Bağlantıyı kapat
    db.close_connection()

    # customers tablosuna created_at ve updated_at kolonlarını ekle
    db.add_missing_timestamps_to_customers()
    db.close_connection() 