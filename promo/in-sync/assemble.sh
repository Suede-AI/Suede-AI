#!/usr/bin/env bash
# Concatenate rendered chunks, add film grain, mux the original soundtrack.
# usage: ./assemble.sh <audio-source.mp4> <out.mp4>
set -euo pipefail
cd "$(dirname "$0")"
AUDIO="$1"; OUT="$2"
ls ../chunks/c_*.mp4 | sort | sed "s#^#file '#; s#\$#'#" > ../chunks/list.txt
ffmpeg -v error -y -f concat -safe 0 -i ../chunks/list.txt -c copy ../chunks/joined.mp4
ffmpeg -v error -y -i ../chunks/joined.mp4 -i "$AUDIO" -map 0:v -map 1:a \
  -vf "noise=c0s=5:c0f=t+u,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -level 4.2 -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 320k -shortest "$OUT"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of compact "$OUT"
