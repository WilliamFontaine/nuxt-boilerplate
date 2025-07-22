#!/bin/bash

# Script to rename the Nuxt boilerplate project
# Usage: ./rename-project.sh <new-project-name>

set -e

# Check arguments
if [ $# -eq 0 ]; then
    echo "❌ Error: Please specify the new project name"
    echo "Usage: $0 <new-project-name>"
    echo "Example: $0 my-awesome-project"
    exit 1
fi

NEW_PROJECT_NAME="$1"

# Validate project name (alphanumeric and hyphens only)
if [[ ! "$NEW_PROJECT_NAME" =~ ^[a-zA-Z0-9-]+$ ]]; then
    echo "❌ Error: Project name must contain only letters, numbers, and hyphens"
    exit 1
fi

echo "🚀 Starting project rename to: $NEW_PROJECT_NAME"

# Save current directory
ORIGINAL_DIR=$(pwd)

# Cleanup function in case of error
cleanup() {
    echo "🧹 Cleaning up..."
    cd "$ORIGINAL_DIR"
}
trap cleanup ERR

# 1. Update package.json
echo "📦 Updating package.json..."
if [ -f "package.json" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/\"name\": \"nuxt-boilerplate\"/\"name\": \"$NEW_PROJECT_NAME\"/" package.json
    else
        # Linux
        sed -i "s/\"name\": \"nuxt-boilerplate\"/\"name\": \"$NEW_PROJECT_NAME\"/" package.json
    fi
    echo "✅ package.json updated"
else
    echo "⚠️  package.json not found"
fi

# 2. Update README.md if it contains references
echo "📖 Checking README.md..."
if [ -f "README.md" ]; then
    if grep -q "nuxt-boilerplate" README.md; then
        echo "📝 Updating README.md..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/nuxt-boilerplate/$NEW_PROJECT_NAME/g" README.md
        else
            sed -i "s/nuxt-boilerplate/$NEW_PROJECT_NAME/g" README.md
        fi
        echo "✅ README.md updated"
    else
        echo "ℹ️  No nuxt-boilerplate references found in README.md"
    fi
else
    echo "ℹ️  README.md not found"
fi

# 3. Update Docker Compose files if they contain references
echo "🐳 Checking Docker Compose files..."
for compose_file in "docker-compose.yml" "docker-compose.yaml" "compose.yml" "compose.yaml"; do
    if [ -f "$compose_file" ]; then
        if grep -q "nuxt-boilerplate" "$compose_file"; then
            echo "🔧 Updating $compose_file..."
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s/nuxt-boilerplate/$NEW_PROJECT_NAME/g" "$compose_file"
            else
                sed -i "s/nuxt-boilerplate/$NEW_PROJECT_NAME/g" "$compose_file"
            fi
            echo "✅ $compose_file updated"
        else
            echo "ℹ️  No nuxt-boilerplate references found in $compose_file"
        fi
    fi
done

# 4. Update GitHub Actions workflows
echo "⚙️  Checking GitHub Actions workflows..."
if [ -d ".github/workflows" ]; then
    for workflow_file in .github/workflows/*.yml .github/workflows/*.yaml; do
        if [ -f "$workflow_file" ]; then
            if grep -q "nuxt-boilerplate" "$workflow_file"; then
                echo "🔧 Updating $workflow_file..."
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s/nuxt-boilerplate/$NEW_PROJECT_NAME/g" "$workflow_file"
                else
                    sed -i "s/nuxt-boilerplate/$NEW_PROJECT_NAME/g" "$workflow_file"
                fi
                echo "✅ $workflow_file updated"
            fi
        fi
    done
else
    echo "ℹ️  .github/workflows directory not found"
fi

# 5. Reinstall dependencies to update lock file
echo "📦 Reinstalling dependencies..."
if command -v pnpm &> /dev/null; then
    echo "🔧 Using pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "🔧 Using yarn..."
    yarn install
elif command -v npm &> /dev/null; then
    echo "🔧 Using npm..."
    npm install
else
    echo "⚠️  No package manager found, please reinstall dependencies manually"
fi

# 6. Clean up the script itself
echo "🧹 Cleaning up..."
read -p "Do you want to remove this renaming script? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm "$0"
    echo "✅ Renaming script removed"
else
    echo "ℹ️  Renaming script kept"
fi

echo ""
echo "🎉 Project successfully renamed!"
echo "📂 Your project is now called: $NEW_PROJECT_NAME"
echo ""
echo "📋 Next recommended steps:"
echo "   1. Test that everything works: npm dev"
echo "   2. Commit the changes: git add . && git commit -m 'Rename project to $NEW_PROJECT_NAME'"
echo "   3. Update the remote repository URL if needed"
echo "   4. Update any deployment configurations"
echo ""
