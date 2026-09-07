---
title: "Siril Workflow mit VeraLux"
date: 2026-04-19T15:06:55+02:00
draft: false
---

# Step 1: Zuschneiden

# Step 2: Plate solving

Werkzeuge -> Astrometrie -> Plate Solving

# Step 3: Hintergrund entfernen

Skripte -> Pytonskripte -> Processing -> AuteBGE

# Step 4: Farbkalibrierung

Bildbearbeitung -> Farbkalibrierung -> Spektrophotometrische Farbkalibrierung

> Achtung:  
> Verwendete Kamera auswählen  
> "Bild speichern" drücken  
> Wird ein andere Dateiname angegeben, muss diese Datei geladen werden, bevor das Bild weiterbearbeitet wird  

# Step 5: VeraLux Silentium

Skripte -> Pytonskripte -> VeraLux -> VeraLux_Silentium.py

# Step 6: Sterne entfernen

Bildbearbeitung -> Sternbearbeitung -> Starnet Sternentfernung

Anschließend *Anzeigemodus* auf __Linear__ umstellen

# Step 7: VeraLux HyperMetric Stretch

Skripte -> Pytonskripte -> VeraLux -> VeraLux_HyperMetric_Stretch.py

> Achtung:  
> Verwendete Kamera auswählen  

# Step 8: Filter anwenden

Bildbearbeitung -> Filter -> Kontrastbegrenzte adaptive Histogrammausgleichung

> Achtung:  
> "Bild speichern" drücken
> Wird ein andere Dateiname angegeben, muss diese Datei geladen werden, bevor das Bild weiterbearbeitet wird  

# Step 9: Sterne mit VeraLux StarComposer wieder einfügen

Skripte -> Pytonskripte -> VeraLux -> VeraLux_StarComposer.py

# (optinal Step 10: HDR Multiscale)

Skripte -> Pytonskripte -> Processing -> HDR_multiscale.py

# Step 11: Farben mit VeraLux Vectra bearbeiten

Skripte -> Pytonskripte -> VeraLux -> VeraLux_Vectra.py


