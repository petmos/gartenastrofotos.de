---
title: "Rsync to exfat"
date: 2024-08-24T18:06:55+02:00
draft: false
---

For backup with rsync I use this in a shell script:

```
#!/bin/bash

SOURCE_PATH="/home/peter/Astrophotos"
DESTINATION_PATH="/media/peter/Intenso/Astrophotos"

if [ ! -d "$DESTINATION_PATH" ]; then
  echo "Cannot find destination dir ${DESTINATION_PATH}! Exit"
  exit
fi

rsync -hvrltD --modify-window=1 --stats --info=progress2 \
    --exclude-from=/home/peter/rsync-homedir-excludes/rsync-Astrophotos.txt \
    "$SOURCE_PATH/" "$DESTINATION_PATH/"
```

More infos at [rsync seems to overwrite already existing file on ExFat](https://superuser.com/questions/763366/rsync-seems-to-overwrite-already-existing-file-on-exfat)
