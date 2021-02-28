const React = require('react')

const { renderToString } = require('react-dom/server')
const path = require('path')

const Html = (assets) =>
    `<!DOCTYPE html>
    <html lang="fr">
        <head>
            <title>SSR Demo</title>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
        </head>
        <body>
            <div id="root" ></div>
            <script src="${assets}" ></script>
        </body>
    </html>`

const reactMiddleware = (req, res) => {
    const body = `${renderToString(Html())}`
    let assets = '/dist/main.js'

    if (process.env.NODE_ENV === 'production') {
        const WebpackAssetsPath = path.resolve(
            'public/dist/webpack-assets.json',
        )
        assets = require(WebpackAssetsPath).main.js
    }
    res.set('Content-Type', 'text/html')
    res.status(200).send(Html(assets))
}
module.exports = reactMiddleware
