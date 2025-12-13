import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadDogs } from '../store/actions/dog.actions'
import { stayService } from '../services/stay.service'
import { DogInfoModal } from '../cmps/DogInfoModal'

import info from '../assets/imgs/icons/info.svg'
import infoReg from '../assets/imgs/icons/info_orange.svg'

export function FeedingChecklist() {
    const dogs = useSelector(storeState => storeState.dogModule.dogs)
    const [stayingDogs, setStayingDogs] = useState([])
    const [checkedDogs, setCheckedDogs] = useState({})
    const [selectedDog, setSelectedDog] = useState(null)

    useEffect(() => {
        loadDogs()
    }, [])

    useEffect(() => {
        if (!dogs.length) return
        loadStayingDogs()
    }, [dogs])

    // async function loadStayingDogs() {
    //     try {
    //         const stays = await stayService.query()
    //         const now = new Date()

    //         const activeStays = stays.filter(stay =>
    //             new Date(stay.startDate) <= now && new Date(stay.endDate) >= now
    //         )

    //         const dogIds = activeStays.map(stay => stay.dogId)
    //         const currentDogs = dogs.filter(dog => dogIds.includes(dog._id))

    //         setStayingDogs(currentDogs)
    //     } catch (err) {
    //         console.error('Cannot load staying dogs:', err)
    //     }
    // }

    async function loadStayingDogs() {
        try {
            const stays = await stayService.query()

            // 🔸 Normalize “today” to the start of the day
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // 🔸 Keep only dogs that are CURRENTLY staying:
            // startDate <= today <= endDate
            const activeStays = stays.filter(stay => {
                const start = new Date(stay.startDate)
                const end = new Date(stay.endDate)

                // Normalize stay dates to start of day as well
                start.setHours(0, 0, 0, 0)
                end.setHours(0, 0, 0, 0)

                return start <= today && end >= today
            })

            const dogIds = activeStays.map(stay => stay.dogId)
            const currentDogs = dogs.filter(dog => dogIds.includes(dog._id))

            setStayingDogs(currentDogs)
        } catch (err) {
            console.error('Cannot load staying dogs:', err)
        }
    }

    function toggleCheck(dogId) {
        setCheckedDogs(prev => ({
            ...prev,
            [dogId]: !prev[dogId],
        }))
    }

    const smallDogs = stayingDogs.filter(dog => dog.size === 'small')
    const bigDogs = stayingDogs.filter(dog => dog.size === 'big')

    return (
        <section dir="rtl" className="feeding-checklist">
            <h1>צ'קליסט האכלות</h1>
            <p>סמן כלב שהאכלה שלו הושלמה</p>

            {stayingDogs.length === 0 ? (
                <p>אין כרגע כלבים בפנסיון.</p>
            ) : (
                <section className="feeding-columns">
                    <div className="feeding-column">
                        <h2>כלבים קטנים</h2>
                        <ul>
                            {smallDogs.map((dog, idx) => (
                                <li key={dog._id}>
                                    <label className="dog-checklist-row">
                                        <input
                                            type="checkbox"
                                            checked={!!checkedDogs[dog._id]}
                                            onChange={() => toggleCheck(dog._id)}
                                        />
                                        <p>{idx + 1}. {dog.name} ({dog.breed})</p>
                                        <button
                                            type="button"
                                            className={
                                                ((dog.med === '' || dog.med === 'אין') &&
                                                    (dog.specialFood === '' || dog.specialFood === 'אין'))
                                                    ? 'details-btn reg'
                                                    : 'details-btn alert'
                                            }
                                            onClick={() => setSelectedDog(dog)}
                                        >
                                            <img
                                                src={
                                                    ((dog.med === '' || dog.med === 'אין' || dog.med === null) &&
                                                        (dog.specialFood === '' || dog.specialFood === 'אין' || dog.specialFood === null))
                                                        ? infoReg
                                                        : info
                                                }
                                                alt="פרטי כלב"
                                            />
                                        </button>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="feeding-column">
                        <h2>כלבים גדולים</h2>
                        <ul>
                            {bigDogs.map((dog, idx) => (
                                <li key={dog._id}>
                                    <label className="dog-checklist-row">
                                        <input
                                            type="checkbox"
                                            checked={!!checkedDogs[dog._id]}
                                            onChange={() => toggleCheck(dog._id)}
                                        />
                                        <p>{idx + 1}. {dog.name} ({dog.breed})</p>
                                        <button
                                            type="button"
                                            className={
                                                ((dog.med === '' || dog.med === 'אין') &&
                                                    (dog.specialFood === '' || dog.specialFood === 'אין'))
                                                    ? 'details-btn reg'
                                                    : 'details-btn alert'
                                            }
                                            onClick={() => setSelectedDog(dog)}
                                        >
                                            <img
                                                src={
                                                    ((dog.med === '' || dog.med === 'אין') &&
                                                        (dog.specialFood === '' || dog.specialFood === 'אין'))
                                                        ? infoReg
                                                        : info
                                                }
                                                alt="פרטי כלב"
                                            />
                                        </button>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {selectedDog && (
                <DogInfoModal
                    dog={selectedDog}
                    onClose={() => setSelectedDog(null)}
                />
            )}
        </section>
    )
}
