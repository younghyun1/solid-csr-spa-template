#!/bin/sh
npm run build
rm -rf ../rust-be-template/fe/*
find ./dist -type f -exec zstd --ultra -22 -f -o {}.zst {} \;

cd ./dist
find . -type f -name '*.zst' | while read file; do
  mkdir -p "../../rust-be-template/fe/$(dirname "$file")"
  cp "$file" "../../rust-be-template/fe/$file"
done
cd ..
