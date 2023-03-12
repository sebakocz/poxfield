#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# initialize Git repository in dist directory
if [ ! -d ".git" ]; then
  git init || { echo "Error: Failed to initialize Git repository"; exit 1; }
fi

# add all changes to the Git staging area
git add -A || { echo "Error: Failed to stage changes"; exit 1; }

# create a new commit
git commit -m 'deploy' || { echo "Error: Failed to commit changes"; exit 1; }

# force push the changes to the gh-pages branch on GitHub
git push -f git@github.com:sebakocz/poxfield.git master:gh-pages || { echo "Error: Failed to push changes"; exit 1; }

# navigate back to the original directory
cd -
