import { MongoClient, ServerApiVersion } from "mongodb"

const uri = 'mongodb+srv://eva-u3-express:AwCMpBUaWHjhs4eD@eva-u3-express.cxz61.mongodb.net/?retryWrites=true&w=majority&appName=eva-u3-express'

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

export default client 
