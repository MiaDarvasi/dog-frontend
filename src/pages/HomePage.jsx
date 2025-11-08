import { useSelector } from "react-redux"
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router"

import { loadDogs, addDog, updateDog, removeDog } from '../store/actions/dog.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { dogService } from '../services/dog'

import { DogList } from '../cmps/DogList'
import { DogFilter } from '../cmps/DogFilter'
import { DogCounter } from "../cmps/DogCounter"
import { IncomeCounter } from "../cmps/IncomeCounter"
import { StayList } from "../cmps/StayList"

import plus from '../assets/imgs/icons/plus.svg'
import paw from '../assets/imgs/icons/paw_orange_full.svg'

export function HomePage() {
    const [filterBy, setFilterBy] = useState(dogService.getDefaultFilter())
    const [showStaying, setShowStaying] = useState(false)
    const dogs = useSelector(storeState => storeState.dogModule.dogs)
    const navigate = useNavigate()

    useEffect(() => {
        loadDogs(filterBy)
    }, [filterBy])

    async function onRemoveDog(dogId) {
        try {
            await removeDog(dogId)
            showSuccessMsg('Dog removed')
        } catch (err) {
            showErrorMsg('Cannot remove dog')
        }
    }

    async function onUpdateDog(dog) {
        const age = +prompt('New age?', dog.age)
        if (age === 0 || age === dog.age) return

        try {
            await updateDog({ ...dog, age })
            showSuccessMsg('Dog updated')
        } catch (err) {
            showErrorMsg('Cannot update dog')
        }
    }

    function goToAddDog() {
        navigate("/add/dog")
    }

    return (
        <section dir="rtl" className="home-page">

            <h1><img src={paw} />פנסיון בהר</h1>
            <h2>ניהול ובקרת מידע על הכלבים שאצלנו בפנסיון</h2>

            <div className="home-actions">
                <button
                    className="add-btn"
                    onClick={goToAddDog}>
                    <img src={plus} /> <span>הוספת כלב חדש</span>
                </button>
                <div className="toggle-buttons">
                    <button
                        className={`toggle-list-btn ${showStaying ? 'selected' : ''}`}
                        onClick={() => setShowStaying(true)}
                        disabled={showStaying}>
                        כלבים בפנסיון / עתידיים
                    </button>

                    <button
                        className={`toggle-list-btn ${!showStaying ? 'selected' : ''}`}
                        onClick={() => setShowStaying(false)}
                        disabled={!showStaying}>
                        כל הכלבים
                    </button>
                </div>
            </div>

            <section className="counters">
                <DogCounter dogs={dogs} />
                <IncomeCounter dogs={dogs} />
            </section>

            <DogFilter filterBy={filterBy} setFilterBy={setFilterBy} />

            {showStaying ? (
                <StayList filterBy={filterBy} />
            ) : (
                <DogList
                    dogs={dogs}
                    onRemoveDog={onRemoveDog}
                    onUpdateDog={onUpdateDog}
                />
            )}
        </section>
    )
}
