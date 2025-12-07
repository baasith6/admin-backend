# Environment Variables Template

Copy this file to `.env` and fill in your values.

```env
# MongoDB Connection
# Your actual connection string (already configured):
MONGODB_URI=mongodb+srv://abdulbaasith1124_db_user:by00T6xCkIPTszYP@cluster0.ffocgca.mongodb.net/agritamizha?retryWrites=true&w=majority&appName=Cluster0

# Server Port
PORT=3000

# JWT Secret for Authentication
# Generate a strong random secret for production
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Node Environment
NODE_ENV=production

# CORS Origins (comma-separated)
# For production, replace with your actual Vercel frontend URLs
CORS_ORIGINS=https://your-admin-frontend.vercel.app,https://your-customer-frontend.vercel.app
```

