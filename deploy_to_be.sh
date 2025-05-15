#!/bin/sh

npm run build
rm -rf ../rust-be-template/fe/*
find ./dist -type f -exec gzip -9 {} \; -exec mv {}.gz {}.gz \;

cd ./dist
find . -type f -name '*.gz' | while read file; do
  mkdir -p "../../rust-be-template/fe/$(dirname "$file")"
  cp "$file" "../../rust-be-template/fe/$file"
done
cd ..
