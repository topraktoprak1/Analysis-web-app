# PostgreSQL Kurulum ve Yapılandırma

## 1. PostgreSQL Kurulumu (Windows)

### PostgreSQL İndir ve Kur:
1. https://www.postgresql.org/download/windows/ adresinden PostgreSQL'i indirin
2. Kurulum sırasında:
   - Port: 5432 (varsayılan)
   - Password: postgres (veya kendi şifrenizi)
   - Locale: Turkish, Turkey veya varsayılan

## 2. Database Oluşturma

### PostgreSQL ile bağlan:
```powershell
# psql ile bağlan
psql -U postgres

# Veya pgAdmin kullan
```

### Database oluştur:
```sql
CREATE DATABASE veri_analizi;
CREATE USER veri_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE veri_analizi TO veri_user;
```

## 3. Python Paketlerini Yükle

```powershell
pip install -r requirements.txt
```

## 4. Environment Variables (Opsiyonel - Production için)

### Windows'ta:
```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/veri_analizi"
```

### Veya .env dosyası oluştur:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/veri_analizi
```

## 5. Uygulamayı Başlat

```powershell
python app.py
```

İlk çalıştırmada otomatik olarak:
- Tablolar oluşturulacak
- Admin kullanıcısı eklenecek (admin/admin123)

## 6. Docker ile PostgreSQL (Alternatif)

### Docker Compose dosyası (docker-compose.yml):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: veri_analizi
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/veri_analizi
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Dockerfile:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "4", "--timeout", "120", "app:app"]
```

### Docker ile çalıştır:
```powershell
docker-compose up -d
```

## 7. Bağlantı Ayarları

### Uygulama şu anda şu ayarlarla çalışıyor:
- Host: localhost
- Port: 5432
- Database: veri_analizi
- User: postgres
- Password: postgres

### Değiştirmek için app.py'deki şu satırı düzenle:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 
    'postgresql://kullanici:sifre@host:port/database_adi')
```

## 8. SQLite'dan PostgreSQL'e Veri Taşıma (Opsiyonel)

Eğer mevcut SQLite veriniz varsa:

```python
# Önce eski veriyi export et
# Sonra yeni PostgreSQL'e import et
```

## Performans Avantajları:

✅ **20k+ satır** için çok daha hızlı
✅ **Concurrent users** - Aynı anda birden fazla kullanıcı
✅ **ACID compliance** - Veri bütünlüğü
✅ **Better indexing** - Hızlı sorgular
✅ **Connection pooling** - Kaynak optimizasyonu
✅ **Production-ready** - Gerçek üretim ortamı için uygun

## Sorun Giderme:

### Bağlantı hatası:
- PostgreSQL servisinin çalıştığından emin olun
- Firewall ayarlarını kontrol edin
- Password'ün doğru olduğundan emin olun

### Port 5432 kullanımda:
```powershell
# Servisi restart et
net stop postgresql-x64-15
net start postgresql-x64-15
```
