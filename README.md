# Web Demo for Ultimate Conditional Syntax

This project is a part of the paper _The Ultimate Conditional Syntax_ for 
OOPSLA 2024 Artifact Evaluation.

## Project Structure

This project follows the structure of a modern web frontend project. According to their functions, they can be classified as follows.

- UI components: `components/**/*`.
- Configurations for the build tool: `vite.config.js`.
- Type annotations: `@types/*.d.ts`, `vite-env.d.ts`.
- Container: `Dockerfile`, `.dockerignore`.
- Editor-related configurations: `.vscode/*`.
- HTML template: `index.html`.
- Tailwind CSS configurations: `tailwind.config.ts`, `postcss.config.js`.

The main code that makes up the web demo is in the `lib` folder. The purpose of the file inside is as follows.

- `lib/codemirror`: Themes for CodeMirror.
- `lib/examples`: The source of code examples.
- `lib/mlscript`: MLscript language support for CodeMirror.
- `lib/store`: Each file represents a store of states used throughout React components.
- `lib/tutorials`: The source of tutorials for MLscript.
- `lib/utils`: Some utility functions.

## External Dependencies

This project uses the following external dependencies, which are used only for creating the web demo. The core algorithms of the artifact and the paper are not implemented by these external dependencies.

- [React][react]: Build web interfaces in a functional way and provide the management of state and effects.
- [Vite][vite]: The build tool and development server.
- [CodeMirror][codemirror]: An extensible code editor component.
- [Lezer][lezer]: A incremental parser framework used by [CodeMirror][codemirror].
- [jotai][jotai]: Advanced state management for React.
- [Tailwind CSS][tailwindcss]: The CSS framework.
- [Zod][zod]: Type validation for JavaScript values.
- [Radix UI][radix-ui]: A collection of UI components.

The remaining dependencies are purely utility, such as `nanoid`, `pluralize`, etc. These will not be elaborated here. People can check the `package.json` file to see all dependencies.

Apart from the libraries mentioned above, there are also some resource dependencies.

- Fonts: [Inter][inter] and [JetBrains Mono][jetbrains-mono].
- Icons used in this project are provided by library [Lucide][lucide] and [Tabler Icons][tabler-icons].

[react]: https://react.dev
[vite]: https://vitejs.dev
[codemirror]: https://codemirror.net
[lezer]: https://lezer.codemirror.net
[jotai]: https://jotai.org
[tailwindcss]: https://tailwindcss.com
[zod]: https://zod.dev
[radix-ui]: https://www.radix-ui.com
[inter]: https://rsms.me/inter/
[jetbrains-mono]: https://www.jetbrains.com/lp/mono/
[lucide]: https://lucide.dev
[tabler-icons]: https://tablericons.com
