import './app.css'
import * as React from "jsx-dom"

class App {
    readonly name = 'Web-Developer'

    /**
     * returns html content
     * @returns html content
     */
    private content() {
        return (
            <h1 class="text-xl text-center mt-8">
                Hello, {this.name}!
            </h1>
        )
    }

    /**
     * bind the content to the DOM
     * @param element
     */
    public bind(element: Element) {
        element.appendChild(this.content())
    }
}

new App().bind(document.getElementById('content')!)

// enables automatic live reload in browser
// https://esbuild.github.io/api/#live-reload
new EventSource('/esbuild').addEventListener('change', () => location.reload())