---
title: "Moonlite Focuser"
date: 2024-11-13T18:37:29+01:00
draft: true
tags:
 - INDI
 - KStars
 - moonlite
 - focuser
 - StellarMate
 - ESP32
 - DIY
images:
 - "/images/astrophotos/2024/11/13/moonlite-focuser/Moonlite-Focuser.jpg"

---

## Motor-Fokussierer mit ESP32 und NEMA-17 Steppermotor (Marke Eigenbau)
{{< image_fullsize src="/images/astrophotos/2024/11/13/moonlite-focuser/Moonlite-Focuser.jpg" 
                   alt="Moonlite Focuser with ESP32 and NEMA-17 stepper" >}}

Der Fokussierer ist INDI-kompatibel und wird über das MoonLite Protokoll angesprochen.
Somit lässt sich der Fokus einfach über KStars/EKOS bzw. die StellarMate-App ansteuern.

Später kommt noch ein Drehgeber dazu, um den Fokus auch manuell nachstellen zu können.

Die Halterung wurde mit openscad gezeichnet und von einem Kollegen mit dem 3D-Drucker erstellt.


### Moonlite Fokussierer in action

{{< rawhtml >}} 

<video width=100% controls autoplay>
    <source src="/video/moonlite-focuser-nema17.mp4" type="video/mp4">
    Your browser does not support the video tag.  
</video>

{{< /rawhtml >}}
