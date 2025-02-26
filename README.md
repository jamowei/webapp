![build](https://github.com/jamowei/spa-simple/actions/workflows/buildAndRelease.yaml/badge.svg)
![GitHub Release](https://img.shields.io/github/v/release/jamowei/spa-simple)


# 😎 WebApp made simple 🎉
Simple WebApp (SPA) using [esbuild](https://esbuild.github.io/), [jsx-dom](https://www.npmjs.com/package/jsx-dom) and [tailwindcss](https://www.npmjs.com/package/tailwindcss)

# 📑 Requirements
* [NodeJS](https://nodejs.org/) for developing the webapp
* [go-task](https://taskfile.dev/) for running tasks inside the `Taskfile.yml` file
* [Docker](https://www.docker.com/) for building the image
* [kubectl](https://kubernetes.io/de/docs/reference/kubectl/) for deploying to [Kubernetes](https://kubernetes.io/)

# 🏗️ Structure
All source-files for the app resides in the `./src` folder.

Where the `./src/main/app.jsx` file is your main entry point
for your app which gets bundled via `esbuild`.
Any custom css goes into the `./src/main/app.css` file and
any static resources (e.g. html, images, etc.) goes into the `./src/resource` folder. 

There is also a `./src/kubernetes/app.ts` file,
which gets compiled to a Kubernetes manifest YAML file.

That's all! 😉

# 💻 Development
To bundle the app in `./src/main/app.tsx`
just run `go-task build` or following commands
```
npm install
node build.mjs
```
This produces all files for the browser inside the `out` folder.

If you want to enable [live-reload](https://esbuild.github.io/api/#live-reload),
just run `go-task serve` or
```
node build.mjs serve
```

# 🐋 Docker
## 🐋 Build 🛠️
Just run `go-task docker-build` or following commands
```
docker build -t ${NAME}:latest .
```
Docker image size is `~112 kB`! 🤯

## 🐋 Run
Just run `go-task docker-run` or following command
```
docker run --name ${NAME} -dt --rm --init -p ${PORT}:3000 ${NAME}:latest
```
Alternatively, you can also use `docker compose up` to start the container, by using the `./docker-compose.yaml`.

## 🐋 Stop
Just run `go-task docker-stop` or following command
```
docker container stop ${NAME}
```

Or use `docker compose stop` to stop the container, when using the `./docker-compose.yaml`.

## 🐋 Cleanup 🧹
Just run `go-task docker-clean` or following command
```
docker image prune
```

# ☸️ Kubernetes
## ☸️ Build 🛠️
To bundle the kubernetes manifest in `./src/kubernetes/app.ts`
just run `go-task k8s` or following commands
```
npm install
node build.mjs k8s
```
This produces the yaml kubernetes manifest file inside the `out` folder.

## ☸️ Apply via kubectl
Just run `go-task k8s-apply namespace=dev-test` ('namespace' is optional) or following command
```
kubectl apply -f out/${NAME}.k8s.yaml --namespace $(namespace)
```

## ☸️ Delete via kubectl
Just run `go-task k8s-delete namespace=dev-test` ('namespace' is optional) or following command
```
kubectl delete -f out/${NAME}.k8s.yaml --namespace $(namespace)
```

# ⚙️ Github Release + Package
Whenever a new commit is pushed on the `main` branch or a pull request is created, the Github workflow gets triggered.
The workflow (`./.github/workflows/buildAndRelease.yaml`) builds the app, Docker image and Kubernetes manifest.

To create a Github Release and publish the app, Docker image and Kubernetes manifest,
you only have to tag the specific commit with `*.*.*` notation ([SemanticVersion](https://semver.org/)).

Just run `go-task release version=1.0.0` or following commands
```
git tag v1.0
git push origin tag v1.0
```

It is also possible to delete a release.
Just run `go-task release-delete version=1.0.0` or following commands
```
git tag -d v1.0
git push --delete origin v1.0
```