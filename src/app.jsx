import './app.css'
import React from "jsx-dom"

const app = async () => {
    const name = 'Foo'
    return (
        <h1 class="text-xl text-center mt-8">
            Hello, {name}!
        </h1>
    )
}

app().then((app) => { document.body.appendChild(app) })

// enables automatic live reload of the page in browser
// https://esbuild.github.io/api/#live-reload
new EventSource('/esbuild').addEventListener('change', () => location.reload())