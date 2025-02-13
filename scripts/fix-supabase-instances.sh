#!/bin/bash

# Find all TypeScript/JavaScript files
find src -type f -name "*.ts" -o -name "*.tsx" | while read -r file; do
  # Check if file contains direct Supabase client creation
  if grep -l "createClient.*process\.env\.NEXT_PUBLIC_SUPABASE" "$file" > /dev/null; then
    echo "Fixing Supabase client in: $file"
    
    # Determine if it's a client-side or server-side component
    if [[ "$file" =~ "app/api/" ]] || [[ "$file" =~ "middleware" ]] || [[ "$file" =~ "server" ]]; then
      # Server-side: Use the server singleton
      sed -i '' 's/import { createClient } from '"'"'@supabase\/supabase-js'"'"'/import { supabase } from '"'"'@\/lib\/supabase'"'"'/g' "$file"
    else
      # Client-side: Use the client singleton
      sed -i '' 's/import { createClient } from '"'"'@supabase\/supabase-js'"'"'/import { supabase } from '"'"'@\/lib\/supabase\/client'"'"'/g' "$file"
    fi
    
    # Remove the client creation
    sed -i '' '/const supabase = createClient(/,/);/d' "$file"
  fi
done

echo "Done fixing Supabase instances" 