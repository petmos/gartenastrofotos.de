---
title: "Cygnus Loop"
date: 2026-07-29T20:46:25+02:00
draft: false
tags:
 - Veil Nebula
 - Cygnus Loop
 - Cirrusnebel
 - Schleiernebel
 - UV/IR Cut
 - Siril
 - VeraLux
 - Juwei-17
images:
  - "/images/astrophotos/2026/07/29/Cygnus_Loop_Askar_FMA180Pro_UVIR_78x120s_g101_o30_T-10C_2026-07-29_step10_removed_green_noise__curve_transformation_from_step8_10_1.0.png"
  - "/images/astrophotos/2026/07/29/Cygnus_Loop_Askar_FMA180Pro_UVIR_150x120s_g101_o30_T-10C_2026-07-29_removed_green_noise_curve_transformation__step8_10_1.0_V2.png"
  - "/images/astrophotos/2026/07/29/Cygnus_Loop_Askar_FMA180Pro_UVIR_150x120s_g101_o30_T-10C_2026-07-29_starless_removed_green_noise_curve_transformation__step8_10_1.0.png"
---

## Cygnus Loop 75 x 120s
{{< image_fullsize src="/images/astrophotos/2026/07/29/Cygnus_Loop_Askar_FMA180Pro_UVIR_78x120s_g101_o30_T-10C_2026-07-29_step10_removed_green_noise__curve_transformation_from_step8_10_1.0.png"
                   alt="Cygnus Loop 75 x 120s" >}}

### Cygnus Loop 150 x 120s
{{< image_fullsize src="/images/astrophotos/2026/07/29/Cygnus_Loop_Askar_FMA180Pro_UVIR_150x120s_g101_o30_T-10C_2026-07-29_removed_green_noise_curve_transformation__step8_10_1.0_V2.png"
                   alt="Cygnus Loop 150 x 120s" >}}

### Cygnus Loop starless 150 x 120s
{{< image_fullsize src="/images/astrophotos/2026/07/29/Cygnus_Loop_Askar_FMA180Pro_UVIR_150x120s_g101_o30_T-10C_2026-07-29_starless_removed_green_noise_curve_transformation__step8_10_1.0.png"
                   alt="Cygnus Loop starless 150 x 120s" >}}

## Workflow

### Filter
Die Aufnahmen wurden diesmal mit einem UV/IR-Cut-Filter und mit Guiding erstellt.  
Den Filter hat mir dankenswerterweise unser Vorstand Christian zur Verfügung gestellt.  

### Guiding
In der Zwischenzeit hatte ich bemerkt, dass in EKOS bei "Guiding via" die Kamera statt der Montierung ausgewählt war.  
Nachdem dies korrigiert war, lief auch das Guiding problemlos.  

### Zeitgesteuerte Aufnahmen
Zum ersten Mal wurden auch im Planer-Modul von Ekos mehrere Aufnahmen, eigentlich nur zwei, geplant. Bei den Steps waren sowohl __Verfolgen__, __Fokus__, __Ausrichten__ als auch __Nachführen__ ausgewählt.  

Nach jedem Job wurde die Montierung geparkt. Damit vermied ich den Meridian-Flip, da ich diesen noch nie zuvor getestet hatte.

Der erste Job startete um 22:33 Uhr und lief bis 01:08 Uhr, der zweite startete um 01:15 Uhr bis 4:04 Uhr.  

### Bearbeitung mit Siril

Von den 150 Aufnahmen wurden zuerst nur die "mittleren" 78 ausgewählt, da die Nacht einfach noch zu kurz war.  
Gestackt wurde wieder mit Siril und anschließend wie in [Siril Workflow mit VeraLux]({{< ref "/notes/siril_workflow_mit_veralux/" >}}) beschrieben, weiter bearbeitet.  
Schließlich wurde nochmal einmal eine Steckung mit der Kurventransformation vorgenommen und das Grün-Rauschen entfernt. 

Anschließend wurden zum Vergleich alle Bilder (wie oben beschrieben) gestacked. Davon ist auch eine Starless-Variante ist hier zu sehen.


### Aufnahme-Details

| Metadata        |                     |
|-----------------|---------------------|
| description     | Siril               |
| target          | Cygnus Loop         |
| telescope       | Askar FMA180Pro     |
| aperture        | f/4.5               |
| focallength     | 180 mm              |
| mount           | Juwei-17            |
| camera          | ASI533MC-Pro        |
| gain            | 101                 |
| offset          | 30                  |
| cooling         | -10 °C              |
| exposure        | 120 s               |
| frames          | 78 / 150            |
| totalexposure   | 156 / 300 min       |
| location        | Pfettrach           |
| date            | 29.07.2026          |

## [Wikipedia zum Cirrusnebel](https://de.wikipedia.org/wiki/Cirrusnebel)
<table><tr><td>
"Der Cirrusnebel (auch als Schleier-Nebel, englisch Veil nebula bezeichnet) ist der im optischen Spektrum sichtbare Teil des Cygnusbogens, 
einer Ansammlung von Emissions- und Reflexionsnebeln, die sich in einer Entfernung von rund 2500 Lichtjahren im Sternbild Schwan befinden. 
Sie sind zusammen der Überrest einer Supernova, die vor ca. 8.000[4] Jahren stattfand."
</td></tr></table>
