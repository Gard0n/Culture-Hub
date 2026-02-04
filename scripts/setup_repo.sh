#!/usr/bin/env bash
# Helper script to initialize a git repo and create remote via GH CLI.
# Usage: ./scripts/setup_repo.sh <github-owner>/<repo-name>

if [ -z "$1" ]; then
  echo "Usage: $0 owner/repo"
  exit 1
fi

REPO=$1

echo "Initializing local git repository..."
git init
git add .
git commit -m "Initial commit - Culture Hub scaffold"

echo "To create the GitHub repo and push, run (requires gh CLI):"

echo "  gh repo create $REPO --public --source=. --remote=origin --push"

echo "Or create repo in GitHub UI and set remote:"

echo "  git remote add origin git@github.com:$REPO.git"

echo "  git branch -M main"

echo "  git push -u origin main"

exit 0
