#!/bin/bash

# Rollback script for GameHoarde
# Usage: ./rollback.sh <version>

set -e

VERSION=$1
if [ -z "$VERSION" ]; then
    echo "Usage: ./rollback.sh <version>"
    echo "Available versions:"
    git tag -l | grep -E "^v[0-9]" | tail -10
    exit 1
fi

echo "Starting rollback to version: $VERSION"

# 1. Backup current state
echo "Creating backup of current deployment..."
BACKUP_TAG="backup-$(date +%Y%m%d-%H%M%S)"
git tag $BACKUP_TAG
git push origin $BACKUP_TAG

# 2. Database backup (if schema changes)
echo "Backing up database..."
mongodump --uri=$MONGODB_URI --out=backups/rollback-$BACKUP_TAG

# 3. Switch to target version
echo "Switching to version $VERSION..."
git checkout $VERSION

# 4. Install dependencies
echo "Installing dependencies..."
npm run install-all

# 5. Run database migrations (if any)
if [ -f "scripts/rollback-migrations/$VERSION.js" ]; then
    echo "Running rollback migrations..."
    node scripts/rollback-migrations/$VERSION.js
fi

# 6. Build frontend
echo "Building frontend..."
cd frontend && npm run build && cd ..

# 7. Deploy
echo "Deploying..."
if [ "$DEPLOYMENT_METHOD" = "docker" ]; then
    docker build -t gamehorde:$VERSION .
    docker stop gamehorde || true
    docker run -d --name gamehorde --env-file .env.production gamehorde:$VERSION
else
    # Render deployment
    git push origin $VERSION:main --force
fi

# 8. Health check
echo "Performing health check..."
sleep 30
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL/api/health)

if [ $HEALTH_CHECK -eq 200 ]; then
    echo "Rollback successful!"
    echo "Application is healthy at version $VERSION"
else
    echo "Health check failed! Status: $HEALTH_CHECK"
    echo "Manual intervention required"
    exit 1
fi

# 9. Create rollback log
echo "{
  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"version\": \"$VERSION\",
  \"backup_tag\": \"$BACKUP_TAG\",
  \"status\": \"success\"
}" >> logs/rollbacks.json

echo "Rollback completed successfully!"