const http = require('http')
const fs = require('fs')
const url = require('url')
const {
    agregar,
    obtener,
    editar,
    borrar
} = require('./index')

http
    .createServer(async (req, res) => {
        if (req.url == "/") {
            const html = fs.readFileSync('./public/index.html', 'utf-8')
            res.setHeader('content-type', 'text/html')
            res.end(html)
        }

        if (req.url.startsWith("/cancion") && req.method == "POST") {
            let body = ""
            req.on("data", (datos) => {
                body += datos
            })
            req.on("end", async () => {
                // console.log(JSON.parse(body))
                await agregar(Object.values(JSON.parse(body)))
                res.end()
            })
        }
        if (req.url.startsWith("/canciones") && req.method == 'GET') {
            const cancion = await obtener()
            res.setHeader('content-type', 'application/json')
            // console.log(cancion.rows)
            res.end(JSON.stringify(cancion.rows))
           
        }

        if (req.url.startsWith("/cancion") && req.method == 'PUT') {
            let body = ""
            req.on("data", (datos) => {
                body += datos
            })
            req.on("end",async () => {
                const datosEditar = Object.values(JSON.parse(body))
                const respuesta = await editar(datosEditar)
                res.end(JSON.stringify(respuesta))
            })
        }
        if (req.url.startsWith("/cancion") && req.method == 'DELETE') {
            const id = url.parse(req.url, true).query.id
            await borrar(id)
            console.log(id)
            res.end()
        }


    })
    .listen(3000, () => console.log("Puerto 3000"))