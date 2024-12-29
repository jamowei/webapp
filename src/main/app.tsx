import "./app.css";
import * as React from "jsx-dom";

class App {
  readonly name = "Web-Developer";

  /**
   * returns html content
   * @returns html content
   */
  private content() {
    return (
        <div class="absolute top-0 w-full h-full bg-[url('img/background.jpg')] bg-no-repeat bg-center bg-cover">
          <div class="bg-blue-950 opacity-90 shadow-xl max-w-3xl mx-auto text-center md:rounded-xl md:mt-8 px-4 sm:px-6 lg:px-8 py-16 md:py-12">
            <h1 class="text-gray-200 text-3xl font-bold md:text-4xl lg:text-5xl">
                WebApp made easy
            </h1>
            <p class="mt-8 md:mt-4 md:text-lg text-gray-300">
              Free, ready-to-use responsive WebApp using JSX and Tailwind CSS to build your own site
              at lightning speed. Then all gets bundled in a Docker container for easy deployment.
            </p>
          </div>
        </div>
    );
  }

  /**
   * bind the content to the DOM
   * @param element
   */
  public bind(element: Element) {
    element.appendChild(this.content());
  }
}

new App().bind(document.getElementById("content")!);

// enables automatic live reload in browser
// https://esbuild.github.io/api/#live-reload
new EventSource("/esbuild").addEventListener("change", () => location.reload());
