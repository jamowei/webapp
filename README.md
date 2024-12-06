# spa-simple
Simple SPA using [esbuild](https://esbuild.github.io/), [jsx-dom](https://www.npmjs.com/package/jsx-dom) and [tailwindcss](https://www.npmjs.com/package/tailwindcss)

# Requirements
* [NodeJS](https://nodejs.org/) or similar javascript engine
* [Docker](https://www.docker.com/) or similar container engine

# Development
All source-files for the app resides in `src` folder. 
Where the `src/main/app.jsx` file is your main entry point for `esbuild`.
Any custom css goes into the `app.css` file and any static resource (e.g. html, ico, etc.) goes into the `src/resource` folder. That's all! 🙂

# Build App (for Production)
Just run `make` or following commands
```
npm install
node build.mjs
docker build -t ${NAME}:latest .
```

# Serve App (for Development)
Just run `make serve` or following commands
```
npm install
node build.mjs serve
```

# Run Docker App
Just run `make run` or following commands
```
docker run --name ${NAME} -dt --rm --init -p ${PORT}:3000 ${NAME}:latest
```

# Stop Docker App
Just run `make stop` or following commands
```
docker container stop ${NAME}
```

# Github Action
Whenever a commit gets pushed to the `main` branch a workflow gets triggered, which builds the app.
You can create a Github release by tagging a specific commit with `v*.*` and push it to the repository.
```
git tag v1.0
git push origin tag v1.0
```