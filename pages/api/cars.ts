import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export interface Filter {
    mark: string
    models: string[]
}

export interface Body {
    filter: Filter
    page: number
}

export interface Engine {
    power: number
    volume: number
    transmission: string
    fuel: string
}
export interface Car {
    _id: string
    mark: string
    model: string
    drive: string
    equipmentName: string
    createdAt: string
    price: number
    engine: Engine
}

export interface Response {
    pages: number
    cars: Car[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const itemsLimit = 20
        const filter: Filter = req.body.filter
        let page = req.body.page
        if (!page || page < 1) page = 1

        const db = (await clientPromise).db("hrTest")
        let pipeline: any = [
            { $sort: { _id: 1 } },
            {
                $facet: {
                    count:  [{ $count: "total" }],
                    cars: [
                        {
                            $skip: (page - 1) * itemsLimit
                        },
                        {
                            $limit: itemsLimit
                        }
                    ]
                }
            },

        ]
        if (filter.mark?.length) {
            if (Array.isArray(filter.models) && filter.models[0]?.length) {
                pipeline.unshift({
                    $match: {
                        model: {
                            $in: filter.models
                        }
                    }
                })
            } else {
                pipeline.unshift({
                    $match: { mark: filter.mark }
                })
            }
        }
        const cars = await db
            .collection("stock")
            .aggregate(pipeline)
            .toArray()

        res.json({
            pages: Math.ceil(cars[0].count[0].total/itemsLimit),
            cars: cars[0].cars
        })
    } catch (e) {
        console.error(e);
    }
}