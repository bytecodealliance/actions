# `bytecodelliance/actions` - GitHub Action collection for setting up wasmtime/wasm-tools


With the `bytecodealliance/actions` collection, you can easily setup [wasmtime](https://github.com/bytecodealliance/wasmtime) and [wasm-tools](https://github.com/bytecodealliance/wasm-tools) in your [GitHub Action](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow). 

This collection of Actions enables the following use cases:

- [x] set up wasmtime using [`bytecodealliance/actions/wasmtime/setup@v1`](#install-wasmtime-cli---bytecodeallianceactionswasmtimesetupv1)
- [x] set up wasm-tools using [`bytecodealliance/actions/wasm-tools/setup@v1`](#install-wasm-tools-cli---bytecodeallianceactionswasm-toolssetupv1)

Let's take a look at each one to learn about the required inputs and walk through an example. 

## Install wasmtime - `bytecodealliance/actions/wasmtime/setup@v1`

### Inputs

| Name         | Required | Default | Description                                                                                                                                 |
| ------------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| version      | False    | latest  | The version of `wasmtime` to install.                                                                                                           |
| github_token | False    | -       | The GitHub token for querying/downloading `wasmtime` releases. If provided, it avoids GitHub API rate limiting during GitHub action executions |

### Examples

#### Setting up the latest version of `wasmtime` 

```yaml
name: wasmtime setup

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
          version: "v13.0.0"

      - name: Run `wasmtime version`
        run: "wasmtime --version"
```


## Install wasm-tools - `bytecodealliance/actions/wasm-tools/setup@v1`

### Inputs

| Name         | Required | Default | Description                                                                                                                                 |
| ------------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| version      | False    | latest  | The version of `wasm-tools` to install.                                                                                                           |
| github_token | False    | -       | The GitHub token for querying/downloading `wasm-tools` releases. If provided, it avoids GitHub API rate limiting during GitHub action executions |

### Examples

#### Setting up the latest version of `wasm-tools` 

```yaml
name: wasm-tools setup

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
