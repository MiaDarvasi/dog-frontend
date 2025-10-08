import { useState, useEffect } from 'react'

import search from '../assets/imgs/icons/search.svg'
import plus from '../assets/imgs/icons/plus.svg'

export function DogFilter({ filterBy, setFilterBy }) {
    const [filterToEdit, setFilterToEdit] = useState(filterBy)

    useEffect(() => {
        setFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleChange(ev) {
        const { name, value } = ev.target
        setFilterToEdit({ ...filterToEdit, [name]: value })
    }

    function onClearFilter() {
        const clearedFilter = { ...filterToEdit, name: '', breed: '' }
        setFilterToEdit(clearedFilter)
    }

    return (
        <section className="dog-filter">
            <img src={search} alt="search icon" />
            <input
                type="text"
                name="name"
                value={filterToEdit.name}
                placeholder="חפש לפי שם"
                onChange={handleChange}
            />
            <input
                type="text"
                name="breed"
                value={filterToEdit.breed}
                placeholder="חפש לפי גזע"
                onChange={handleChange}
            />

            {/* Clear button */}
            <button className="btn-clear" onClick={onClearFilter}>
                <img src={plus} />
            </button>
        </section>
    )
}
