---
title: "Mogrify and convert images"
date: 2024-12-09T20:27:06+01:00
draft: true
---

# Resize a couple of images at once:

```
mogrify -resize 2731x2731 -quality 100 -path tmp/ *.png
```

# Stick images horizontal (left to right): 

```
convert *.png +append 2024-11-30.png 
```
