import { useState, useEffect } from 'react'

import search from '../assets/imgs/icons/search.svg'
import plus from '../assets/imgs/icons/plus.svg'

export function DogFilter({ filterBy, setFilterBy }) {
    const [filterToEdit, setFilterToEdit] = useState(filterBy)

    useEffect(() => {
        // Always update parent filter when input changes — even when cleared
        setFilterBy({ ...filterToEdit, txt: filterToEdit.txt || '' })
    }, [filterToEdit.txt])
    

    function handleChange(ev) {
        const { value } = ev.target
        setFilterToEdit({ ...filterToEdit, txt: value })
    }

    function onClearFilter() {
        setFilterToEdit({ ...filterToEdit, txt: '' })
    }

    return (
        <section className="dog-filter">
            <img className="dog-filter-search" src={search} alt="search icon" />
            <input
                type="text"
                name="txt"
                value={filterToEdit.txt}
                placeholder="חפש לפי שם, גזע או מספר צ׳יפ"
                onChange={handleChange}
            />

            <button className="btn-clear" onClick={onClearFilter}>
                <img src={plus} />
            </button>
        </section>
    )
}
