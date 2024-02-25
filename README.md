# bytecodelliance/actions

With the `bytecodealliance/actions` collection, you can easily set up [`wasmtime`](https://github.com/bytecodealliance/wasmtime), [`wasm-tools`](https://github.com/bytecodealliance/wasm-tools), and [`wit-bindgen`](https://github.com/bytecodealliance/wit-bindgen) in your [GitHub Actions](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow) workflow.

This collection of Actions enables the following use cases:

- [x] set up `wasmtime` using [`bytecodealliance/actions/wasmtime/setup@v1`](#install-wasmtime)
- [x] set up `wasm-tools` using [`bytecodealliance/actions/wasm-tools/setup@v1`](#install-wasm-tools)
- [x] set up `wit-bindgen` using [`bytecodealliance/actions/wit-bindgen/setup@v1`](#install-wit-bindgen)

Let’s take a look at each one to learn about the required inputs and walk through an example.

## Install `wasmtime`

### Inputs

| Name         | Required | Default | Description                                                                                                                                 |
| ------------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`      | False    | `latest`  | The version of `wasmtime` to install.                                                                                                           |
| `github_token` | False    | `${{ github.token }}`       | The GitHub token for querying/downloading `wasmtime` releases. If provided, it avoids GitHub API rate limiting during GitHub action executions. |

### Examples

#### Setting up the latest version of `wasmtime`

```yaml
name: wasmtime

on:
  push:
    branches: [main]


jobs:
  setup:
    runs-on: ubuntu-latest
    name: Setup wasmtime
    steps:
      - name: Setup `wasmtime`
        uses: bytecodealliance/actions/wasmtime/setup@v1

      - name: Run `wasmtime version`
        run: "wasmtime --version"
```

#### Setting up a specific version of `wasmtime`

```yaml
name: wasmtime

on:
  push:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    name: Setup wasmtime
    steps:
      - name: Setup `wasmtime`
        uses: bytecodealliance/actions/wasmtime/setup@v1
        with:
          version: "18.0.1"

      - name: Run `wasmtime version`
        run: "wasmtime --version"
```

## Install `wasm-tools`

### Inputs

| Name         | Required | Default | Description                                                                                                                                 |
| ------------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`      | False    | `latest`  | The version of `wasm-tools` to install.                                                                                                           |
| `github_token` | False    | `${{ github.token }}`       | The GitHub token for querying/downloading `wasm-tools` releases. If provided, it avoids GitHub API rate limiting during GitHub action executions |

### Examples

#### Setting up the latest version of `wasm-tools`

```yaml
name: wasm-tools

on:
  push:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    name: Setup wasm-tools
    steps:
      - name: Setup `wasm-tools`
        uses: bytecodealliance/actions/wasm-tools/setup@v1

      - name: Run `wasm-tools version`
        run: "wasm-tools --version"
```

#### Setting up a specific version of `wasm-tools`

```yaml
name: wasm-tools

on:
  push:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    name: Setup wasm-tools
    steps:
      - name: Setup `wasm-tools`
        uses: bytecodealliance/actions/wasm-tools/setup@v1
        with:
          version: "1.0.43"

      - name: Run `wasm-tools version`
        run: "wasm-tools --version"
```

## Install `wit-bindgen`

### Inputs

| Name         | Required | Default | Description                                                                                                                                 |
| ------------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`      | False    | `latest`  | The version of `wit-bindgen` to install.                                                                                                           |
| `github_token` | False    | `${{ github.token }}`       | The GitHub token for querying/downloading `wit-bindgen` releases. If provided, it avoids GitHub API rate limiting during GitHub action executions |

### Examples

#### Setting up the latest version of `wit-bindgen`

```yaml
name: wit-bindgen

on:
  push:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    name: Setup wit-bindgen
    steps:
      - name: Setup `wit-bindgen`
        uses: bytecodealliance/actions/wit-bindgen/setup@v1

      - name: Run `wit-bindgen version`
        run: "wit-bindgen --version"
```

#### Setting up a specific version of `wit-bindgen`

```yaml
name: wit-bindgen

on:
  push:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    name: Setup wit-bindgen
    steps:
      - name: Setup `wit-bindgen`
        uses: bytecodealliance/actions/wit-bindgen/setup@v1
        with:
          version: "0.19.0"

      - name: Run `wit-bindgen version`
        run: "wit-bindgen --version"
```
