<div align="center">

# FEKO 101
### Professional Domino Assistant

[![PWA](https://img.shields.io/badge/PWA-Ready-3b82f6?style=for-the-badge&logo=googlechrome&logoColor=white)](https://farrukhmammadli.github.io/feko101)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-0d1117?style=for-the-badge&logo=android&logoColor=3DDC84)](https://farrukhmammadli.github.io/feko101)
[![Language](https://img.shields.io/badge/Language-Azerbaijani-00B4D8?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[Live Web Application](https://farrukhmammadli.github.io/feko101)** | **[Download Android APK](#android-apk-download)** | **[Rules](#rules-of-101-system)**

</div>

---

## About The Project

FEKO 101 is an intelligent assistant application developed specifically for domino players. It tracks the tiles in your hand during the game, analyzes the probability of tiles in your opponent's hand based on game flow, and recommends the most optimal moves. The system is designed based on the traditional Azerbaijani "101" domino rules.

---

## Key Features

- **Intelligent Advisor**: Recommends the best possible move based on game logic and current board state.
- **Probability Analysis**: Calculates and displays the probability of specific tiles remaining in the opponent's hand.
- **Game Modes**: Supports both 2-player (individual) and 4-player (team) modes.
- **PWA & Offline Support**: Can be installed on mobile devices and works completely offline without an internet connection.
- **Action Management**: Includes a "Undo" feature to cancel accidental or incorrect moves.
- **Lock Detector**: Automatically detects when the game is locked and provides necessary instructions.
- **Scoring System**: Fully implements the 101 scoring rules, tracking points across multiple rounds.
- **Modern Interface**: Features a dark mode UI with glassmorphism elements to reduce eye strain during long gaming sessions.

---

## Android APK Download

You can install the application directly on your Android device.

### Download Link
You can find the installation file in the `releases` folder of this repository:
- **[Download FEKO 101.apk](releases/FEKO_101.apk)**

### Installation Instructions
1. Download the `FEKO_101.apk` file from the link above.
2. Open the downloaded file on your Android device.
3. If prompted, allow installation from "Unknown Sources" in your browser or file manager settings.
4. Complete the installation and open the application.

*Alternative Web Installation:* Open `https://farrukhmammadli.github.io/feko101` in your mobile Chrome browser, open the menu (three dots), and select "Add to Home Screen".

---

## Project Structure

The repository is structured to separate application code from the distribution files:

```text
FEKO 101/
|
|-- releases/
|   |-- FEKO_101.apk         # Android installation package
|
|-- .well-known/
|   |-- assetlinks.json      # Digital asset links for app verification
|
|-- index.html               # Main HTML structure
|-- styles.css               # Styling and responsive design
|-- app.js                   # Core application logic and game engine
|-- sw.js                    # Service Worker for offline PWA capabilities
|-- manifest.json            # PWA configuration manifest
|-- icon.png                 # Application icon
|
|-- Oyunu_Baslat.bat         # Windows script to launch app in mobile resolution
|
|-- README.md                # Documentation (this file)
|-- LICENSE                  # MIT License
|-- .gitignore               # Git exclusion rules
```

---

## Local Execution on Windows

For developers or Windows users who want to run the application locally without a browser or server:

1. Clone or download this repository.
2. Double-click the **`Oyunu_Baslat.bat`** file.
3. The application will automatically open in a dedicated Microsoft Edge or Google Chrome window, resized to mimic a mobile device screen (390x844 resolution) for the best user experience.

---

## Rules of "101 System"

The application operates on the following foundational rules:

**Starting the Game**
- In 2-player mode: Each player draws 7 tiles.
- In 4-player mode (Teams): Each player draws 7 tiles.
- The player with the double-one (1|1) tile starts the game.

**Making Moves**
- Players must match the numbers on the exposed ends of the board.
- If a player does not have a matching tile, they must go to the "bazaar" to draw tiles until they find a match.
- If the bazaar is empty and the player still has no matching tile, they must "pass" their turn.

**Ending the Round**
- The first player to play all their tiles wins the round.
- The winner scores points equal to the sum of the numbers on the tiles remaining in the opponent's (or opposing team's) hands.
- The first player or team to reach a total of 101 points wins the match.

**Locked Game**
- If both ends of the board require the same number, and no player holds a tile with that number, the game is "locked".
- In a locked state, players count the sum of the tiles in their hands. The player/team with the lowest sum wins the round.

---

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PWA Architecture**: Web App Manifest, Service Worker, Cache API
- **Design Elements**: Custom CSS Variables, Flexbox/Grid Layouts, Google Fonts (Outfit, Fira Code)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Copyright (c) 2026 Farrukh Mammadli
</div>
