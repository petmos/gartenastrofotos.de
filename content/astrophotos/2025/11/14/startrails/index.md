---
title: "Startrails"
date: 2025-11-15T15:24:43+01:00
draft: true
description: "Click on image to enlarge." 
tags:
 - Startrails
 - Siril
 - ffmpeg
 - GoPro
images:
  - "/images/astrophotos/2025/11/14/startrails/Startrails_245x30s_2025-11-14.png"
---

{{< image_fullsize src="/images/astrophotos/2025/11/14/startrails/Startrails_245x30s_2025-11-14.png" 
                   alt="Startrails" >}}

## GoPro HERO12 Black

### First Light
Beim First Light mit der GoPro HERO12 Black wurde der __*Zeitraffer bei Nacht*__ verwendet.

Die Verschlusszeit wurde auf das Maximum von __*30 s*__ und das Intervall auf __*auto*__ gestellt.

Die Aufnahmen wurden nur als __*jpg*__ gespeichert.

Während der Nacht wurde die GoPro von einer Jackery Explorer 300 Plus Powerstation mit Strom versorgt.
Somit war es möglich von ca. 22:00 Uhr bis zum nächsten Morgen kurz vor 6:00 Uhr durchgehend Aufnahmen zu machen.

### Startrail mit Siril
Für das mit __*Siril*__ gestackte Startrail-Bild wurden nur die letzten 245 Aufnahmen verwendet, da zuvor immer wieder Wolkenbänder den Blick in den Sternenhimmel verhinderten.
Das Stacken wurde mit dem Script __*DSA-StarTrails-WithoutDBF.ssf*__ durchgeführt.

### Aufnahme-Details

| Metadata              |                       |
|------------|------------------------------------|
| target     | Startrails                         |
| description | Startrails with GoPro HERO12 Black |
| telescope  | GoPro HERO12 Black                 |
| aperture   | f/2.5                              |
| focallength | 15 mm                              |
| camera     | GoPro HERO12 Black                 |
| exposure   | 30s                                |
| frames     | 245                                |
| location   | Pfettrach (Garten)                 |
| date       | 14.11.2025                         |

### Timestamps einfügen
Mit Hilfe eines Python-Scriptes wurden aus allen Bildern die Exif-Informationen bzgl. des Aufnahmezeitpunktes herausgeholt und als Overlay im Bild eingefügt. 

### ffmpeg
Insgesamt kamen somit 906 Aufnahmen zustande, aus denen mit __*ffmeg*__ ein Timelapse-Video erstellt wurde:
```bash {class="my-class" id="my-codeblock" lineNos=inline tabWidth=2}
ffmpeg -framerate 30 -pattern_type glob -i "lights/resized/*.JPG" -s:v 1440x1080 -c:v libx264 -crf 17 -pix_fmt yuv420p timelapse_w_stamps_2025-11-13.mp4
```



## Timelapse

{{< rawhtml >}} 

<video width=100% controls autoplay>
    <source src="/video/timelapse_w_stamps_2025-11-14.mp4" type="video/mp4">
    Your browser does not support the video tag.  
</video>

{{< /rawhtml >}}

