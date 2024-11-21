import { ObjectId } from "mongodb";
import client from "../common/db.js";


const actorCollection = client.db('cine-db').collection('actores')
const peliculaCollection = client.db('cine-db').collection('peliculas')


// Insertar un actor//
export async function handleInsertActorRequest(req, res) {
    let data = req.body
    const peliculaId = new ObjectId(data.idPelicula)

    peliculaCollection.findOne({ _id: peliculaId })
    .then(pelicula => {
        if (!pelicula) {
            return res.status(404).send({ message: 'Película no existe' })
        }
        let actor = {
            _id: new ObjectId(),
            idPelicula: pelicula._id.toString(),
            nombre: data.nombre,
            edad: data.edad,
            estaRetirado: data.estaRetirado,
            premios: data.premios
        }
        return actorCollection.insertOne(actor)
    })
    .then(result => {
        if (!result.acknowledged) {
            return res.status(400).send({ message: 'Error al guardar registro' })
        }
        return res.status(201).send(result)
    })
    .catch(e => {
        console.log(e)
        return res.status(500).send({ error: 'Error interno del servidor' })
    })
}



// Extraer todos los actores de la base de datos//
export async function handleGetActoresRequest(req, res) {
    await actorCollection.find({}).toArray()
        .then((actores) => {
            return res.status(200).send(actores)
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).send({ error: 'Error interno del servidor' })
        })
}



// Sacar un actor por id //
export async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id
    try {
        let oid = ObjectId.createFromHexString(id)
        await actorCollection.findOne({ _id: oid })
            .then((actor) => {
                if (!actor) {
                    return res.status(404).send({ message: 'Actor no existe' })
                }
                return res.status(200).send(actor)
            })
            .catch((e) => {
                console.log(e);
                return res.status(500).send({ error: e.message })
            });
    } catch (e) {
        return res.status(400).send({ error: 'Id mal formado' })
    }
}



// Obtener los actores por el nombre de la pelicula//
export async function handleGetActoresByPeliculaNombreRequest(req, res) {
    let nombrePelicula = req.params.id
    try {
        console.log(`Buscando la película: ${nombrePelicula}`)
        const pelicula = await peliculaCollection.findOne({ nombre: nombrePelicula })
        if (!pelicula) {
            return res.status(404).send({ message: 'Película no se encuentra' })
        }
        console.log(`Película hallada: ${pelicula._id}`)
        const actores = await actorCollection.find({ idPelicula: pelicula._id.toString() }).toArray()
        if (!actores || actores.length === 0) {
            return res.status(404).send({ message: 'No existen registros de estos actores para esta película' })
        }
        console.log(`Actores encontrados: ${actores.length}`)
        return res.status(200).send(actores)
    } catch (e) {
        console.log(e);
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
}


export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaNombreRequest
};