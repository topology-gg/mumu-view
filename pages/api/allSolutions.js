
import clientPromise from "../../lib/mongodb"
import { DB_NAME, COLLECTION_NAME } from '../../src/constants/constants'

export default async function handler(req, res) {

    const client = await clientPromise

    const db = client.db(DB_NAME)
    const solutions = await db
        .collection(COLLECTION_NAME)
        .find({
            instructions: {
                $not: { $size: 0 }
            },
            delivered: {
                $gte: 0
            }
        })
        .sort({
            '_chain.valid_from': -1 // prefer latest
        })
        .limit (100) // get 100 most recent solutions
        .toArray()

    res.status(200).json({ 'solutions': solutions })
}
