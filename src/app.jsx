import './app.css'
import React from "jsx-dom"

const app = () => {
    const name = 'Foo'
    return (
        <h1 class="text-xl text-center mt-8">
            Hello, {name}!
        </h1>
    )
}

document.body.appendChild(app())

// enables automatic live reload of the page in browser
// https://esbuild.github.io/api/#live-reload
new EventSource('/esbuild').addEventListener('change', () => location.reload())