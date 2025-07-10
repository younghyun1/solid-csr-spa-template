#!/bin/sh
npm run build
rm -rf ../rust-be-template/fe/*
find ./dist -type f ! -iname '*.png' ! -iname '*.jpg' -exec zstd --ultra -22 -f -o {}.zst {} \;

cd ./dist
# Copy zstd'd files
find . -type f -name '*.zst' | while read file; do
  mkdir -p "../../rust-be-template/fe/$(dirname "$file")"
  cp "$file" "../../rust-be-template/fe/$file"
done
# Copy original .png and .jpg files as-is
find . -type f \( -iname '*.png' -o -iname '*.jpg' \) | while read file; do
  mkdir -p "../../rust-be-template/fe/$(dirname "$file")"
  cp "$file" "../../rust-be-template/fe/$file"
done
cd ..
