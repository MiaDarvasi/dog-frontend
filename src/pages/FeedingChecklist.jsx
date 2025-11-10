import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadDogs } from '../store/actions/dog.actions'
import { stayService } from '../services/stay.service'

export function FeedingChecklist() {
    const dogs = useSelector(storeState => storeState.dogModule.dogs)
    const [stayingDogs, setStayingDogs] = useState([])
    const [checkedDogs, setCheckedDogs] = useState({})

    useEffect(() => {
        loadDogs() // fetch all dogs
    }, [])
    
    useEffect(() => {
        if (!dogs.length) return
        loadStayingDogs()
    }, [dogs])

    async function loadStayingDogs() {
        try {
            const stays = await stayService.query()
            const now = new Date()

            // Filter active stays (current or today)
            const activeStays = stays.filter(stay =>
                new Date(stay.startDate) <= now && new Date(stay.endDate) >= now
            )

            // Map dog IDs to dog objects
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

    return (
        <section dir="rtl" className="feeding-checklist">
            <h1>צ'קליסט האכלות</h1>
            <p>סמן כלב שהאכלה שלו הושלמה</p>

            {stayingDogs.length === 0 ? (
                <p>אין כרגע כלבים בפנסיון.</p>
            ) : (
                <ul>
                    {stayingDogs.map((dog, idx) => (
                        <li key={dog._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!checkedDogs[dog._id]}
                                    onChange={() => toggleCheck(dog._id)}
                                />
                                <p>{idx + 1}. {dog.name}</p>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
