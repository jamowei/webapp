![build](https://github.com/jamowei/spa-simple/actions/workflows/buildAndRelease.yaml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jamowei/spa-simple)


# 😎 WebApp made simple 🎉
Simple WebApp (SPA) using [esbuild](https://esbuild.github.io/), [jsx-dom](https://www.npmjs.com/package/jsx-dom) and [tailwindcss](https://www.npmjs.com/package/tailwindcss)

# 📑 Requirements
* [Docker](https://www.docker.com/) for building the image
* [NodeJS](https://nodejs.org/) for developing the webapp
* [Helm](https://helm.sh/) for deploying to [Kubernetes](https://kubernetes.io/)

# 🏗️ Structure
All source-files for the app resides in `./src` folder. 
Where the `./src/main/app.jsx` file is your main entry point for `esbuild`.
Any custom css goes into the `app.css` file and any static resource (e.g. html, ico, etc.) goes into the `./src/resource` folder. That's all! 😉

# 💻 Development
Just run `make` or following commands
```
npm install
node build.mjs
```
This produces all files for the browser inside the `out` folder.

If you want to enable [live-reload](https://esbuild.github.io/api/#live-reload),
just run `make serve` or
```
node build.mjs serve
```

# 🐋 Docker
## 🐋 Build 🛠️
Just run `make docker_build` or following commands
```
docker build -t ${NAME}:latest .
```
Docker image size is `~112 kB`! 🤯

## 🐋 Run
Just run `make docker_run` or following command
```
docker run --name ${NAME} -dt --rm --init -p ${PORT}:3000 ${NAME}:latest
```
Alternatively, you can also use `docker compose up` to start the container, by using the `./docker-compose.yaml`.

## 🐋 Stop
Just run `make docker_stop` or following command
```
docker container stop ${NAME}
```

Or use `docker compose stop` to stop the container, when using the `./docker-compose.yaml`.

## 🐋 Cleanup 🧹
Just run `make docker_clean` or following command
```
docker image prune
```

# ☸️ Kubernetes
## ☸️ Install
There is a helm chart provided under `./helm` directory.

Just run `make helm_install` or following command
```
helm upgrade --install --wait --create-namespace --namespace ${NAME} ${NAME} ./helm
```

## ☸️ Uninstall
Just run `make helm_uninstall` or following command
```
helm uninstall --namespace ${NAME} ${NAME}
```

# ⚙️ Github Release + Package
Whenever a new commit is pushed on the `main` branch or a pull request is created, the Github workflow gets triggered.
The workflow (`./.github/workflows/buildAndRelease.yaml`) builds the app, Docker image and Helm chart.

To create a Github Release and publish the app, Docker image and Helm chart,
you only have to tag the specific commit with `*.*.*` notation ([SemanticVersion](https://semver.org/)).

Just run `make release version=1.0.0` or following commands
```
git tag v1.0
git push origin tag v1.0
```

It is also possible to delete a release.
Just run `make release_delete version=1.0.0` or following commands
```
git tag -d v1.0
git push --delete origin v1.0
```