#!/bin/sh
npm run build
rm -rf ../rust-be-template/fe/*
find ./dist -type f ! -iname '*.png' ! -iname '*.jpg' \
  -exec sh -c 'gzip -9 -c "$1" > "$1.gz"' _ {} \;

cd ./dist
# Copy gzip'd files
find . -type f -name '*.gz' | while read file; do
  mkdir -p "../../rust-be-template/fe/$(dirname "$file")"
  cp "$file" "../../rust-be-template/fe/$file"
done
# Copy original .png and .jpg files as-is
find . -type f \( -iname '*.png' -o -iname '*.jpg' \) | while read file; do
  mkdir -p "../../rust-be-template/fe/$(dirname "$file")"
  cp "$file" "../../rust-be-template/fe/$file"
done
cd ..
