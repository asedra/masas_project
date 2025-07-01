#!/usr/bin/env python3
"""
Environment dosyası oluşturucu script
"""

import os

def create_env_file():
    """Örnek .env dosyası oluştur"""
    
    env_content = """# PostgreSQL Veritabanı Bağlantı Bilgileri
# Bu dosyayı .env olarak kopyalayın ve kendi bilgilerinizi girin

DB_HOST=10.255.101.4
DB_PORT=5432
DB_NAME=masasdb
DB_USER=postgres
DB_PASSWORD=postgres

# Opsiyonel: SSL ayarları
DB_SSL_MODE=prefer
DB_SSL_CERT=
DB_SSL_KEY=
DB_SSL_CA=

# Opsiyonel: Connection pool ayarları
DB_POOL_SIZE=5
DB_MAX_OVERFLOW=10
DB_POOL_TIMEOUT=30
"""
    
    try:
        with open('.env', 'w', encoding='utf-8') as f:
            f.write(env_content)
        print("✅ .env dosyası oluşturuldu!")
        print("📝 Lütfen .env dosyasında kullanıcı adı ve şifrenizi güncelleyin.")
        return True
    except Exception as e:
        print(f"❌ .env dosyası oluşturulamadı: {e}")
        return False

def check_env_exists():
    """Env dosyasının varlığını kontrol et"""
    if os.path.exists('.env'):
        print("ℹ️  .env dosyası zaten mevcut.")
        return True
    return False

if __name__ == "__main__":
    print("🔧 Environment Dosyası Oluşturucu\n")
    
    if not check_env_exists():
        create_env_file()
    else:
        response = input("Mevcut .env dosyasını yeniden oluşturmak istiyor musunuz? (y/N): ")
        if response.lower() in ['y', 'yes']:
            create_env_file()
        else:
            print("❌ İşlem iptal edildi.") 