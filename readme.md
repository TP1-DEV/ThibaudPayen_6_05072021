# SO PEKOCKO

Projet 6 du parcours développeur web Openclassrooms : "Construisez une API sécurisée pour une application d'avis gastronomiques"

#### Prérequis

- [NodeJs](https://nodejs.org/en/) en version 14 LTS

## INSTALLATION

### FRONTEND

#### Prérequis:

- [windows-build-tools](https://www.npmjs.com/package/windows-build-tools) `npm install -g windows-build-tools`
- [npm](https://docs.npmjs.com/try-the-latest-stable-version-of-npm) `npm install -g npm@latest`
- [angular-cli](https://github.com/angular/angular-cli) `npm install -g @angular/cli`
- [node-sass](https://www.npmjs.com/package/node-sass) : attention à prendre la version correspondante à NodeJS. Pour Node 14.0 par exemple, installer node-sass en version 4.14+, pour ce projet : `npm install node-sass@4.14`

Sur Windows, ces installations nécessitent d'être exécuté en tant qu'administrateur.

- Depuis le dossier /frontend, exécuter `npm install`
- Démarrer le serveur de developpement en exécutant la commande `ng serve`
- Le serveur se trouve à l'adresse http://localhost:4200

### BACKEND

- Depuis le dossier /backend, exécuter `npm install`
- Démarrer le serveur en exécutant la commande `npm run start:dev`
- Le serveur écoute à l'adresse http://localhost:3000
- Renommer le fichier .env.exemple en .env et compléter les champs requis avec vos propres données.


## SCENARIO

Vous êtes développeur backend freelance et vous travaillez depuis quelques années sur des projets web pour des startups ou des grandes entreprises.

La semaine dernière, vous avez reçu un mail vous proposant un nouveau projet.

La marque So Pekocko, qui crée des sauces piquantes, connaît un franc succès, en partie grâce à sa chaîne de vidéos YouTube “La piquante”.

L’entreprise souhaite désormais développer une application d’évaluation de ses sauces piquantes, appelée “Piquante”.

Même si l’application deviendra peut-être un magasin en ligne dans un futur proche, Sophie, la product owner de So Pekocko 
a décidé que le MVP du projet sera une application web permettant aux utilisateurs d’ajouter leurs sauces préférées 
et de liker ou disliker les sauces ajoutées par les autres utilisateurs.
## COMPETENCES EVALUEES

- Implémenter un modèle logique de données conformément à la réglementation.
- Mettre en œuvre des opérations CRUD de manière sécurisée.
- Stocker des données de manière sécurisée.

## TRAVAIL REALISE

- Création de la partie backend du site en orienté objet.
- Utilisation de Typescript, NodeJS, Express, MongoDB.
- Mise en place de sécurité selon le projet OWASP. Hachage des données sensibles en DB.
- Jest pour la partie test.