import express, { urlencoded } from 'express'
import cors from 'cors'
import client from './src/common/db.js'
import peliculaRoutes from './src/pelicula/pelicula.Routes.js'
import actorRoutes from './src/actor/actor.Routes.js'


const PORTS = process.env.PORT || 3000;
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: true}))
app.use(cors())

app.all('/', (req, res) => { return res.status(200).send('Bienvenido al cine Iplacex')})


app.use('/api', peliculaRoutes)
app.use('/api', actorRoutes)

await client.connect()
.then(() => {
    console.log('Conectado al clúster exitosamente')
app.listen(PORTS, () => { console.log(`Servidor corriendo en http://localhost:${PORTS}`)})
})
.catch(() => {
    console.log('Error al conectar al clúster', err.message)
})