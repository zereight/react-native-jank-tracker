#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/objc2swift.sh <ios_directory>
# Converts Objective-C Turbo module stubs (.h/.mm) into Swift stub files.

if [ $# -ne 1 ]; then
  echo "Usage: $0 <ios_directory>"
  exit 1
fi

IOS_DIR="$1"

if [ ! -d "$IOS_DIR" ]; then
  echo "Error: Directory '$IOS_DIR' not found"
  exit 1
fi

# Process each header file
for hdr in "$IOS_DIR"/*.h; do
  [ -f "$hdr" ] || continue
  
  # Extract class name and protocol
  classname=$(grep -oE '@interface +[^ ]+' "$hdr" | awk '{print $2}')
  protocol=$(grep -oE '<[^>]+>' "$hdr" | tr -d '<>')
  swiftfile="$IOS_DIR/${classname}.swift"
  
  echo "Generating Swift stub: $swiftfile"

  # Write Swift file header
  cat > "$swiftfile" <<EOF
// Auto-generated from $hdr
import Foundation
import $protocol

@objc($classname)
class $classname: NSObject, $protocol {
  @objc static func moduleName() -> String! {
    return "$classname"
  }
EOF

  # Parse Objective-C methods in the .mm file
  mmfile="$IOS_DIR/${classname}.mm"
  if [ -f "$mmfile" ]; then
    # Find method signatures (lines starting with '-')
    grep -E '^\s*- \(' "$mmfile" | while read -r line; do
      # Extract return type
      ret=$(echo "$line" | sed -E 's/^- \(([^)]+)\).*/\1/')
      # Extract method name and params (Objective-C style)
      signature=$(echo "$line" | sed -E 's/^- \([^)]*\)\s*([^ {]+)\s*\{.*/\1/')
      # Convert Objective-C colons to Swift parameter style
      swiftSig=$(echo "$signature" | sed -E 's/:([^ ]+)/(_ \1)/g')

      # Append Swift method stub
      cat >> "$swiftfile" <<METHOD

  @objc func $swiftSig -> $ret {
    // TODO: implement
  }
METHOD
    done
  fi

  # Close class definition
  echo -e "\n}" >> "$swiftfile"
done

echo "Swift conversion complete."

# Update Podspec to use Swift sources only and set Swift version
PODSPEC_PATH="$(dirname "$IOS_DIR")/JankTracker.podspec"
if [ -f "$PODSPEC_PATH" ]; then
  echo "Backing up Podspec to ${PODSPEC_PATH}.bak"
  cp "$PODSPEC_PATH" "${PODSPEC_PATH}.bak"
  echo "Updating Podspec source_files to Swift only"
  sed -i '' 's|s.source_files = \"ios/\*\*/*.{h,m,mm,cpp}\"|s.source_files = \"ios/**/*.swift\"|' "$PODSPEC_PATH"
  echo "Adding Swift version to Podspec"
  sed -i '' '/install_modules_dependencies/a\
  s.swift_version = \"5.0\"' "$PODSPEC_PATH"
else
  echo "Warning: Podspec not found at $PODSPEC_PATH"
fi

# Backup and remove Objective-C stub files
echo "Backing up Objective-C files to objc_backup directory"
BACKUP_DIR="$IOS_DIR/objc_backup"
mkdir -p "$BACKUP_DIR"
mv "$IOS_DIR"/*.h "$IOS_DIR"/*.mm "$BACKUP_DIR"/ || true
echo "Objective-C files moved to $BACKUP_DIR" 