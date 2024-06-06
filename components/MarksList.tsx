import {useState, MouseEvent} from "react";

interface Mark {
    name: string
    count: number
}

interface Props {
    marks: Mark[]
    onClick: (mark: string | null) => void
}
export default function MarksList({ marks, onClick }: Props) {
    const [selectedMark, setSMark] = useState<HTMLAnchorElement>()

    const markHandler = (e: MouseEvent<HTMLAnchorElement>) => {
        const target = e.target as HTMLAnchorElement
        if (selectedMark === target) {
            selectedMark.classList.remove("markSelected")
            setSMark(undefined)
            onClick(null)
            return
        }
        if (selectedMark) selectedMark.classList.remove("markSelected")
        target.classList.add("markSelected")

        setSMark(target)
        onClick(target.innerText)
    }

    return (
        <div className="marks">
            {marks.map(el => (
                <div className="marks mark" key={el.name}>
                    <a onClick={markHandler}>{el.name}</a>
                    <span>{el.count}</span>
                </div>
            ))}

            <style jsx>{`
                .marks {
                    display: flex;
                    flex-direction: row;
                    gap: 0.75rem;
                    font-family: Cambria, serif;
                    flex-wrap: wrap;
                }

                .mark {
                    gap: 0.25rem;
                }

                .mark > a {
                    color: cornflowerblue;
                    font-weight: 600;
                    cursor: pointer;
                }

                .markSelected {
                    color: #1a56b3 !important;
                }
            `}</style>
        </div>
    )
}