#!/bin/bash

# Course Representative Management System Setup Script

echo "🚀 Setting up Course Representative Management System..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    brew install postgresql@14
    brew services start postgresql@14
    echo "✅ PostgreSQL installed and started"
else
    echo "✅ PostgreSQL already installed"
fi

# Add PostgreSQL to PATH
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# Create database if it doesn't exist
echo "🗄️  Setting up database..."
createdb course_rep_db 2>/dev/null || echo "Database already exists"

# Run database schema
echo "📋 Creating database tables..."
psql -d course_rep_db -f database_schema.sql > /dev/null 2>&1
echo "✅ Database schema created"

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install
echo "✅ Dependencies installed"

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << 'EOF'
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=mac
DB_PASSWORD=
DB_NAME=course_rep_db

# JWT Configuration
JWT_SECRET=course_rep_jwt_secret_2024_secure_key
JWT_RESET=course_rep_reset_jwt_secret_2024_secure_key

# Email Configuration (Gmail example)
SERVICE=gmail
SERVICE_USER=your_email@gmail.com
SERVICE_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update the email configuration in .env file"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the server:"
echo "  npm run dev    # Development mode with auto-reload"
echo "  npm start      # Production mode"
echo ""
echo "Server will be available at: http://localhost:4000"
echo ""
echo "API Documentation: See README.md for detailed API endpoints" 