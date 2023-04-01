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

<img width="702" alt="light" src="https://user-images.githubusercontent.com/59973863/229295412-c17bc084-5e85-455d-9cb4-7930bf9fc2f4.png">
<img width="707" alt="dark" src="https://user-images.githubusercontent.com/59973863/229295414-fb1093fa-010a-41b2-80e7-ccfcc2dfcd1f.png">


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
