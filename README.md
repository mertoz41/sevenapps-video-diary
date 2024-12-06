# Video Diary App

## Overview

The Video Diary App allows users to import videos, crop specific 5-second segments, add metadata (such as name and description), and save the cropped videos for future reference. The app features a clean and efficient user interface, built with modern React Native practices, and ensures scalability and performance by leveraging state management and asynchronous operations.

## Installation & Development Environment
Install necessary packages upon cloning the repo.

```npm i```

Due to native modules used in this project, it cannot be opened on expo go and a development build is necessary. 

For simulator

```eas build --profile development-simulator --platform ios```

For physical device

```eas build --profile development --platform ios```


Run the app

```npx expo start --dev-client```


## Technologies Used
• Expo: Base framework for React Native development.

• Expo Router: For implementing app navigation.

• Zustand: State management solution.

• Tanstack Query: To manage async logic and the FFMPEG cropping process.

• FFMPEG: Core library for video processing.

• NativeWind: Styling solution.

• Expo Video: Video rendering and playback (or any suitable alternative).

• Expo SQLite: For structured, persistent storage.

• Zod/Yup: Validation schemas for form handling.


