# 🌸 Habit Tracker

A simple habit tracker desktop app made with [Tauri](https://tauri.app/) utilizing [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

- Schedule habits to complete
- Track streaks
- Edit habits

## Built with

- [Tauri](https://tauri.app/) an OS-agnostic app construction toolkit
- [Next.js](https://nextjs.org/) full-stack React framework
- [TypeScript](https://www.typescriptlang.org/) a strongly typed programming language that builds on JavaScript

#### Assets

> [App icon](https://icons8.com/icon/dR8yCG0Td1WH/check-all) by [Icons8](https://icons8.com")

## Screenshots

<img width="920" alt="habits view" src="https://github.com/dejmedus/tauri-habit-tracker/assets/59973863/bbbf4da5-f53a-4d00-9d74-b7e175ae99e9">
<img width="920" alt="modal" src="https://github.com/dejmedus/tauri-habit-tracker/assets/59973863/5a524d5f-1b21-41b2-9e0b-2d924338420e">
<img width="920" alt="darkmode" src="https://github.com/dejmedus/tauri-habit-tracker/assets/59973863/d7fd48b7-2513-4360-b4b2-78bdb0be6055">


## Setup

1. Clone the repo

```shell
git clone https://github.com/dejmedus/tauri-habit-tracker.git
```

2. Using the terminal, move into your local copy

```shell
cd tauri-habit-tracker
```

3. _Optionally_ install Tauri recommended IDE environment

   - [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

4. Install dependencies

```shell
npm i
```

5. Run the app

```shell
npm run tauri dev
```

6. Build

```
CI=true npm run tauri build
```
