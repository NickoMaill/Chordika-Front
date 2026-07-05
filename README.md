# The Baseline (Front)

Pour installer les dépendances ouvrez un terminal a la racine du projet et tapez :

```bash
cd ./my-react-template && npm i
```

Créez un fichier .env.development.local a la racine du rojet dans lequel vous ecrirez :

```bash
NODE_ENV=development

# URI
# ------------------------------
VITE_API_BASEURL=http://localhost:5155
VITE_APP_BASEURL=http://localhost:3000
```

pour lancer le server nodejs en mode development :

```bash
npm run dev
```

pour build un fichier de deploiement :

```
npm run build
```

pour servir votre fichier de build :

```
npm run start
```

> ⚠️ **vous devez possédez la librairie serve**
