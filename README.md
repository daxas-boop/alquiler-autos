# Sistema de alquiler de autos (CRUD/ABM)

## Overview
Sistema de alquiler de autos (backoffice)

## Correr localmente
1. Clonar el proyecto localmente.
2. Copiar y pegar el contenido de .env.dist en un nuevo archivo llamado .env </br>
3. Correr en la consola `npm install`. </br>
4. Correr en la consola `npm run dev`. </br>
5. Abrir en el navegador una ventana en [http://localhost:8080](http://localhost:8080) </br>

## Agregando modelos
Cuando creamos un nuevo modelo de sequelize agregarlo al archivo src/cli/init.db.js para que la base de dato sincronice con el nuevo modelo.

## Diagramas
![Diagrama de C4 nivel 1](./docs/c4-alquiler-autos-1.png)
![Diagrama de C4 nivel 2](./docs/c4-alquiler-autos-2.png)
![Diagrama de C4 nivel 3](./docs/c4-alquiler-autos-3.png)

## Dependencias
- [connect-session-sequelize](https://www.npmjs.com/package/connect-session-sequelize)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](http://expressjs.com/)
- [express-session](https://www.npmjs.com/package/express-session)
- [multer](https://www.npmjs.com/package/multer)
- [nunjucks](https://mozilla.github.io/nunjucks/)
- [rsdi](https://www.npmjs.com/package/rsdi)
- [sequelize](https://sequelize.org/)
- [sqlite3](https://www.npmjs.com/package/sqlite3)

## Dependencias de desarrollo
- [@types/jest](https://www.npmjs.com/package/@types/jest)
- [eslint](https://eslint.org/)
- [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base)
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
- [jest](https://jestjs.io/docs/en/getting-started)
- [jsdoc](https://jsdoc.app/)
- [nodemon](https://www.npmjs.com/package/nodemon)
