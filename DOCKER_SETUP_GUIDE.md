# 🐳 Docker Setup Guide for CartVerse

## Problem
Docker and Docker Compose are not installed on your system. The backend API needs a database to function.

## Solution Options

### **Option 1: Install Docker Desktop (Recommended)**

Docker Desktop includes both Docker and Docker Compose.

#### Windows Installation:
1. **Download Docker Desktop:** https://www.docker.com/products/docker-desktop
2. **Install** the downloaded file
3. **Restart your computer**
4. **Verify installation:**
   ```powershell
   docker --version
   docker-compose --version
   ```

#### What You Get:
- ✅ Docker Engine
- ✅ Docker Compose
- ✅ Docker CLI
- ✅ Docker Desktop UI (optional but helpful)

---

### **Option 2: Use WSL2 (If you prefer Linux environment)**

If you're on Windows 10/11, you can use Windows Subsystem for Linux:

1. **Enable WSL2:**
   ```powershell
   wsl --install
   ```
2. **Install Docker in WSL2**
3. **Use Linux commands from PowerShell**

---

### **Option 3: Skip Docker - Use Supabase Only (For Development)**

If you don't want to install Docker, update your `.env` file to use Supabase PostgreSQL directly:

```env
# Replace this:
DATABASE_URL="postgresql://postgres:mockpassword@localhost:5432/cartverse_local"

# With your Supabase credentials:
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.yjzkfwyattiibfgnngiv.supabase.co:5432/postgres?schema=public"
```

Then restart the backend:
```powershell
npm run server
```

---

## After Docker Installation

### Start Services:
```powershell
cd c:\Users\Ashwin\OneDrive\Desktop\e-commerce
docker-compose -f docker-compose.base44.yml up -d
```

### Check Status:
```powershell
docker-compose -f docker-compose.base44.yml ps
```

### View Logs:
```powershell
docker-compose -f docker-compose.base44.yml logs -f api
```

### Stop Services:
```powershell
docker-compose -f docker-compose.base44.yml down
```

---

## Troubleshooting

### "docker-compose: command not found"
- Ensure Docker Desktop is fully installed
- Restart PowerShell or your terminal
- Check Windows PATH settings

### Port Already in Use
```powershell
# Find and stop container using port 5000
docker ps
docker stop <container_id>
```

### Database Connection Issues
```powershell
# Check if db container is running
docker-compose -f docker-compose.base44.yml ps

# View database logs
docker-compose -f docker-compose.base44.yml logs db
```

---

## What Docker Runs

When you start Docker Compose, it runs:

| Service | Port | Purpose |
|---------|------|---------|
| **web** | 3000 | Frontend (React/Vite) |
| **api** | 5000 | Backend API (Node.js/Express) |
| **db** | 3306 | MySQL Database |
| **deps** | - | Node dependencies installer |
| **migrate** | - | Database migration runner |

---

## Quick Start (After Docker Installation)

```powershell
# 1. Navigate to project
cd c:\Users\Ashwin\OneDrive\Desktop\e-commerce

# 2. Start all services
docker-compose -f docker-compose.base44.yml up -d

# 3. Wait 30 seconds for services to initialize

# 4. Open in browser
http://localhost:3000

# 5. Check if it works
http://localhost:3000/api/health
```

---

## Still Having Issues?

Try these commands for debugging:

```powershell
# See what's running
docker ps -a

# Check container logs
docker logs container_name

# Restart everything fresh
docker-compose -f docker-compose.base44.yml down
docker-compose -f docker-compose.base44.yml up -d

# Full cleanup (warning: removes data)
docker-compose -f docker-compose.base44.yml down -v
docker-compose -f docker-compose.base44.yml up -d
```
