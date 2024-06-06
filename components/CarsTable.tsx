import {Car} from "@/pages/api/cars";
import {Table} from "antd";

const cols = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Марка/модель',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Модификация',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Комплектация',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
    },
    {
        title: 'Стоимость',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Дата создания',
        dataIndex: 'createdAt',
        key: 'createdAt',
    }
]

function buetifyPrice(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const dateFormatOpt: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
}
const carsToTable = (cars: Car[]) => {
    return cars.map(car => ({
        key: car._id,
        id: car._id,
        name: car.mark + " " + (car?.model || ""),
        type: `${car.engine.volume.toFixed(1)} ${car.engine.transmission} `
            + `(${car.engine.power} л.с.) ${car.engine.transmission}`,
        equipmentName: car.equipmentName,
        price: buetifyPrice(car.price) + " ₽",
        createdAt: (new Date(car.createdAt))
            .toLocaleString('ru-RU', dateFormatOpt)
            .replace(',', ''),
    }))
}

interface Props {
    cars: Car[] | undefined
}

export default function CarsTable({ cars }: Props) {
    return (
        <Table dataSource={cars ? carsToTable(cars) : undefined} columns={cols} pagination={false}/>
    )
}