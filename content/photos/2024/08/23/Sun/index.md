---
title: "Sun"
date: 2024-08-23T22:17:02+02:00
draft: true
description: "Click on image to enlarge. Return with ESC" 
tags:
 - Sun
 - PlanetarySystemStacker
 - Siril
 - LuckyImaging
resources:
 - title: 'Sun processing results'
   src: '1_processing_results.png'
 - title: 'Sun PSS PostprocessingVersion 1 and Siril Split Bregman'
   src: 'indi_record_2024-08-23@13-44-00.ser_F0001-1010_pss_f202_p20_b48_ap140_gpp_v1_deconvulation_split_bregman_gimp.resized.png'
 - title: 'Sun PSS PostprocessingVersion 1'
   src: 'indi_record_2024-08-23@13-44-00.ser_F0001-1010_pss_f202_p20_b48_ap133_gpp_v1_siril.png'
 - title: 'Sun PSS PostprocessingVersion 2'
   src: 'indi_record_2024-08-23@13-44-00.ser_F0001-1010_pss_f202_p20_b48_ap133_gpp_v2_siril.png'
---

## Aufnahmedetails
|Setup       |                          |
|------------|--------------------------|
|Teleskop | SkyWatcher EvoGuide 50ED |
|Filter|euro EMC Sonnenfilter|
|Montierung | Skywatcher AZ-GTi |
|Kamera | ASI533MC-Pro |
|Gain | 101 |
|Offset | 30 |
|Cooling | -10°C |
|Format|SER (Video Stream)|
|Frames | 1010@19.88fps |
|Ort | Pfettrach (Garten) |
|Datum | 23.08.2024 |

## Workflow
Der gesamte Workflow erfolgt unter Linux.
Hierbei kam das [(siehe Wikipedia:) LuckyImaging](https://en.wikipedia.org/wiki/Lucky_imaging)-Verfahren zum Einsatz.

Die verwendeten Tools sind:
1. [Wikipedia: KSTars & Ekos](https://de.wikipedia.org/wiki/KStars)
1. [SER Player](https://github.com/cgarry/ser-player)
1. [Wikipedia: PlanetarySystemStacker](https://de.wikipedia.org/wiki/PlanetarySystemStacker)
1. [Wikipedia: Siril](https://en.wikipedia.org/wiki/Siril_(software))

### Aufnahme des Video Streams in KStars als SER
In KStars wurde dazu ein Video Stream als SER mit 19.88fps aufgezeichnet. Insgesamt wurden 1010 Frames aufgezeichnet.

### Konvertierung SER zu avi im SER Player
Da der PlanetarySystemStacker (PSS) unter Linux Probleme mit dem Einlesen von SER-Dateien hat, musste diese zuerst im SER Player in avi konvertiert werden.

### Stacking im PlanetarySystemStacker mit avi als Rohdaten
Die Frames wurden mit __drizzle factor string = Off__ gestacked, wobei nur die besten 200 Frames verwendet wurden.
Beim Postprocessing wurden folgende Einstellungen verwendet:

```
[PostprocessingVersion 1 RGBAlignment]
rgb automatic = True
rgb gauss width = 7
rgb resolution index = 1
rgb shift red y = 0.0
rgb shift red x = 0.0
rgb shift blue y = 0.0
rgb shift blue x = 0.0

[PostprocessingVersion 1 Layer 0]
postprocessing method = Multilevel unsharp masking
radius = 1.0
amount = 200.0
bilateral fraction = 0.0
bilateral range = 20
denoise = 0.0
luminance only = False

[PostprocessingVersion 2 RGBAlignment]
rgb automatic = True
rgb gauss width = 7
rgb resolution index = 1
rgb shift red y = 0.5
rgb shift red x = 0.0
rgb shift blue y = 0.0
rgb shift blue x = 0.0

[PostprocessingVersion 2 Layer 0]
postprocessing method = Multilevel unsharp masking
radius = 2.0
amount = 200.0
bilateral fraction = 0.0
bilateral range = 20.0
denoise = 0.0
luminance only = False

```

### Deconvolution in Siril with Split Bregman Dekonvolution


