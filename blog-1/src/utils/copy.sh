#!/bin/sh
cd E:/project/node-server/blog-1/logs/
cp access.log ${date +%Y-%m-%d}.access.log
echo "" > access.log
