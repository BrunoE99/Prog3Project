# README

Aplicacion web desarrollada con [Next.js](https://nextjs.org), integrando la [Reviews Website API](https://github.com/MatiRaimondi1/Reviews-Website).

Nuestra página permite a los usuarios buscar películas y escribir y/o leer reseñas y comentarios; además de unirse y/o crear grupos donde pueden crear juntadas (meets) y escribir reseñas grupales.

Los objetivos son ofrecerles a los usuarios un lugar donde puedan expresarse libremente y calificar las películas que vieron; unirse junto a otras personas con gustos similares para crear reseñas conjuntas y que puedan discutir sobre las calificaciones o reseñas que fueron escritas por ellos u por otros usuarios.

## Setup

Para ejecutar en modo de desarrollo:

```bash
npm i
npm run dev
```

o para crear y ejecutar un build de produccion:

```bash
npm run build
npm run start
```

luego dirigirse a [`http://localhost:3000`](http://localhost:3000).

## Localizacion

La aplicacion usa [next-intl](https://next-intl.dev/), con la cofigruacion [i18n](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing), para localizar a ingles y español.

Toma la configuracion de tu browser, excepto que sea un idioma no soportado, en ese caso usa el idioma predeterminado, fijado en `routing.ts` (actualmente español).

Idiomas adicionales pueden ser agregados desde `routing.ts`, pero requiere crear un archivo `[locale].json` con el mismo esquema ya encontrado en `en.json` o `es.json`.
