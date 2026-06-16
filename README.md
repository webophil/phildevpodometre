# PhilDev Podomètre

Une application de podomètre moderne et performante construite avec React Native et Expo.

## Fonctionnalités

- 🚶‍♂️ Suivi des pas en temps réel (via `expo-sensors`).
- 📊 Visualisation des données avec des graphiques interactifs.
- 📅 Historique des activités.
- 🎨 Interface utilisateur moderne basée sur un système de design cohérent.
- 📱 Compatible iOS, Android et Web.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/webophil/phildevpodometre.git
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez l'application :
   ```bash
   npx expo start
   ```

## Technologies utilisées

- **Framework** : [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Navigation** : [Expo Router](https://docs.expo.dev/router/introduction/)
- **Graphiques** : [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)
- **Icônes** : [@expo/vector-icons](https://docs.expo.dev/guides/icons/)
- **Style** : StyleSheet (React Native) avec un système de thèmes personnalisé.

## Structure du projet

- `app/` : Routes et écrans de l'application (Expo Router).
- `src/api/` : Logique d'accès aux données et mock APIs.
- `src/components/` : Composants UI réutilisables.
- `src/data/` : Données de test et constantes.
- `src/hooks/` : Hooks personnalisés (ex: `usePedometer`).
- `src/theme.js` : Configuration du design system (couleurs, typographie, espacement).

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT
