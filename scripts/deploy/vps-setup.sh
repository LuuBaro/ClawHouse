#!/bin/bash

# OPENCLAW ONE-COMMAND SERVER SETUP
# For: Ubuntu 22.04+ VPS

set -e

echo "🚀 Khởi động quá trình cài đặt OPENCLAW CONTENT HOUSE..."

# 1. Update & Install Docker
sudo apt update && sudo apt install -y curl git
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Setup Folder Structure
mkdir -p /opt/openclaw/content-house/data/postgres
cd /opt/openclaw/content-house

# 3. Pull Repository (Yêu cầu SSH keys)
# git clone git@github.com:User/ClawHouse.git .

# 4. Initialize Env
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Hãy cập nhật file .env với các secrets thực tế trước khi chạy docker-compose."
fi

# 5. Build and Start
sudo docker compose up -d --build

echo "✅ Đã khởi chạy hệ thống!"
echo "➡️  API: http://localhost:3001"
echo "➡️  Web: http://localhost:3000"
echo "➡️  n8n: http://localhost:5678"
