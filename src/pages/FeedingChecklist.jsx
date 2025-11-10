// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { loadDogs } from '../store/actions/dog.actions'
// import { stayService } from '../services/stay.service'
// import { DogInfoModal } from '../cmps/DogInfoModal'

// import info from '../assets/imgs/icons/info.svg'


// export function FeedingChecklist() {
//     const dogs = useSelector(storeState => storeState.dogModule.dogs)
//     const [stayingDogs, setStayingDogs] = useState([])
//     const [checkedDogs, setCheckedDogs] = useState({})
//     const [showModal, setShowModal] = useState(false)


//     useEffect(() => {
//         loadDogs() // fetch all dogs
//     }, [])

//     useEffect(() => {
//         if (!dogs.length) return
//         loadStayingDogs()
//     }, [dogs])

//     function openModal() {
//         setShowModal(true)
//     }

//     function closeModal() {
//         setShowModal(false)
//     }

//     async function loadStayingDogs() {
//         try {
//             const stays = await stayService.query()
//             const now = new Date()

//             // Filter active stays (current or today)
//             const activeStays = stays.filter(stay =>
//                 new Date(stay.startDate) <= now && new Date(stay.endDate) >= now
//             )

//             // Map dog IDs to dog objects
//             const dogIds = activeStays.map(stay => stay.dogId)
//             const currentDogs = dogs.filter(dog => dogIds.includes(dog._id))

//             setStayingDogs(currentDogs)
//         } catch (err) {
//             console.error('Cannot load staying dogs:', err)
//         }
//     }

//     function toggleCheck(dogId) {
//         setCheckedDogs(prev => ({
//             ...prev,
//             [dogId]: !prev[dogId],
//         }))
//     }

//     return (
//         <section dir="rtl" className="feeding-checklist">
//             <h1>צ'קליסט האכלות</h1>
//             <p>סמן כלב שהאכלה שלו הושלמה</p>

//             {stayingDogs.length === 0 ? (
//                 <p>אין כרגע כלבים בפנסיון.</p>
//             ) : (
//                 <ul>
//                     {stayingDogs.map((dog, idx) => (
//                         <li key={dog._id}>
//                             <label>
//                                 <input
//                                     type="checkbox"
//                                     checked={!!checkedDogs[dog._id]}
//                                     onChange={() => toggleCheck(dog._id)}
//                                 />
//                                 <p>{idx + 1}. {dog.name}</p>
//                                 <button className="details-btn" onClick={openModal}> <img src={info} /></button>
//                                 {showModal && <DogInfoModal dog={dog} onClose={() => setShowModal(false)} />}
//                             </label>
//                         </li>
//                     ))}
//                 </ul>
//             )}

//         </section>
//     )
// }


import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadDogs } from '../store/actions/dog.actions'
import { stayService } from '../services/stay.service'
import { DogInfoModal } from '../cmps/DogInfoModal'

import info from '../assets/imgs/icons/info.svg'

export function FeedingChecklist() {
    const dogs = useSelector(storeState => storeState.dogModule.dogs)
    const [stayingDogs, setStayingDogs] = useState([])
    const [checkedDogs, setCheckedDogs] = useState({})
    const [selectedDog, setSelectedDog] = useState(null) // 👈 store the selected dog

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
                            <label className="dog-checklist-row">
                                <input
                                    type="checkbox"
                                    checked={!!checkedDogs[dog._id]}
                                    onChange={() => toggleCheck(dog._id)}
                                />
                                <p>{idx + 1}. {dog.name} {`(${dog.breed})`}</p>
                                <button
                                    type="button"
                                    className="details-btn"
                                    onClick={() => setSelectedDog(dog)} // 👈 open modal for this dog
                                >
                                    <img src={info} alt="פרטי כלב" />
                                </button>
                            </label>
                        </li>
                    ))}
                </ul>
            )}

            {selectedDog && (
                <DogInfoModal
                    dog={selectedDog}
                    onClose={() => setSelectedDog(null)} // 👈 close modal
                />
            )}
        </section>
    )
}
