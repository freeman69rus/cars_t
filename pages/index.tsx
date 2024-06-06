import clientPromise from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import {Pagination, Select} from "antd";
import {useEffect, useState} from "react";
import {Car, Filter, Response} from "./api/cars";
import MarksList from "@/components/MarksList";
import CarsTable from "@/components/CarsTable";
import Head from "next/head";

interface CarsInfo {
  _id: string
  count: number
  models: string[]
}

interface Props {
  carsInfo?: CarsInfo[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const db = (await clientPromise).db("hrTest")
    const stock = db.collection("stock")
    const carsInfo = await stock.aggregate<CarsInfo>([
      {
        $group: {
          _id: "$mark",
          count: { $sum: 1 },
          models: { $addToSet: "$model" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    return {
      props: { carsInfo }
    }
  } catch (e) {
    console.error(e);
    return {
      props: {},
    };
  }
};

const fetchCars = (filter: Filter, page: number) => fetch("/api/cars", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({filter, page})
}).then(res => res.json())

export default function Home({ carsInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!carsInfo) return <span>error</span>

  const [filter, setFilter] = useState<Filter>({mark: "", models: []})
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [cars, setCars] = useState<Car[]>()
  const [models, setModels] = useState<any[]>([])

  useEffect(() => { fetchCars(filter, page).then((res: Response) => {
    setCars(res.cars)
    setPages(res.pages)
  })}, [filter, page])

  const markHandler = (mark: string | null) => {
    setFilter({mark: mark || "", models: []})
    setPage(1)
    if (!mark) {
      setModels([])
      return
    }
    for (let car of carsInfo) {
      if (car._id !== mark) continue
      setModels(car.models.map(m => ({ value: m, label: m })))
      return
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Cars</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MarksList
          marks={carsInfo.map(c => ({name: c._id, count: c.count}))}
          onClick={markHandler}
      />
      <div className="modelsSelector">
        <Select
            mode="multiple"
            placeholder="Модель"
            options={models}
            onChange={(v) => {
              setFilter({...filter, models: v})
              setPage(1)
            }}
            value={filter.models}
        />
      </div>

      <CarsTable cars={cars}/>
      <div className="paginationCont">
        <Pagination
            current={page}
            total={pages}
            pageSize={1}
            responsive={true}
            onChange={setPage}
            showSizeChanger={false}
            size="small"
        />
      </div>

      <style jsx>{`
        .container {
          padding: 0 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 2.5em;
        }
        
        .modelsSelector {
          width: 400px;
          display: flex;
          flex-direction: column;
        }
        
        .paginationCont {
          max-width: 260px;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}
