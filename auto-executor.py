#!/usr/bin/env python3
import subprocess
import os

# Auto-execute deployment
if os.path.exists('deploy-workflows.sh'):
    print("🚀 Auto-executing deployment...")
    subprocess.run(['./deploy-workflows.sh'], check=False)
else:
    print("📦 Creating deployment package...")
    subprocess.run(['python3', 'auto-deploy-workflows.py'], check=False)
