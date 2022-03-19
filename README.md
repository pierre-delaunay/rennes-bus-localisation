# Position des bus en circulation sur le réseau STAR en temps réel 🚌

Il s'agit d'une application React utilisant [AWS Location Service](https://aws.amazon.com/fr/location/) et permettant de localiser la position des bus actuellement en circulation sur le réseau STAR de Rennes Métropole.

Les données proviennent du site [STAR Data Explore](https://data.explore.star.fr/explore/dataset/tco-bus-vehicules-position-tr/information).

![Carte](https://i.imgur.com/m5abfFO.png)

## Installation ‍🔧

1. Installation d'Amplify CLI : `npm install -g @aws-amplify/cli`
2. Installation des dépendances du projet : `npm install`
3. Création d'un environnement de projet Amplify : `amplify init`
4. Création des ressources Auth et Geo: `amplify push`
5. Créer un fichier `.env` contenant vos variables d'environnement :

```
REACT_APP_MAPBOX_TOKEN=<mapbox_token>
REACT_APP_STAR_API_ENDPOINT=https://data.explore.star.fr/api/records/1.0/search/?dataset=tco-bus-vehicules-position-tr&q=&rows=100&facet=numerobus&facet=nomcourtligne&facet=sens&facet=destination&refine.etat=En+ligne
REACT_APP_STAR_API_KEY=<api_key>
```
## Nettoyage 🗑️

Exécuter la commande suivante pour supprimer les ressources AWS utilisées par l'application :

```bash
amplify delete
```