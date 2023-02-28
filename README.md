# Habit Tracker

A simple habit tracker made with [Tauri](https://tauri.app/) utilizing [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

- Schedule habits to complete
- Track streaks
- Edit habits

## Built with

- [Tauri](https://tauri.app/) an OS-agnostic app construction toolkit
- [Next.js](https://nextjs.org/) full-stack React framework
- [TypeScript](https://www.typescriptlang.org/) a strongly typed programming language that builds on JavaScript


## Screenshots

<img width="681" alt="habits" src="https://user-images.githubusercontent.com/59973863/221506997-3ff68776-750a-45ef-a20c-c6d3b7691219.png">

## Setup

1. Clone the repo
```shell
git clone https://github.com/dejmedus/tauri-habit-tracker.git
```

2. Using the terminal, move into your local copy

```shell
cd tauri-habit-tracker
```

3. *Optionally* install Tauri recommended IDE environment
   - [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

4. Run the app

```shell
npm run tauri dev
```

5. Build
```
CI=true npm run tauri build
```
