
import clientPromise from "../../../lib/mongodb"
import { DB_NAME, COLLECTION_NAME } from '../../../src/constants/constants'

export default async function handler(req, res) {

    const client = await clientPromise
    const { minimum } = req.query

    const db = client.db(DB_NAME)
    const solutions = await db
        .collection(COLLECTION_NAME)
        .find({
            instructions: {
                $not: { $size: 0 }
            },
            delivered: {
                $gte: parseInt(minimum)
            }
        })
        .sort({
            'delivered': -1, // prefer large
            'static_cost': +1, // prefer small
            'latency': +1, // prefer small
            'dynamic_cost': +1, // prefer small
            '_chain.valid_from': +1 // prefer small
        })
        .limit (20) // get top 20 solutions; TODO: reject same solution on contract side
        .toArray()

    res.status(200).json({ 'solutions': solutions })
}
