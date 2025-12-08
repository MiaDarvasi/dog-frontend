// import { useEffect, useState } from "react"
// import { stayService } from "../services/stay.service"
// import { dogService } from "../services/dog"
// import { showErrorMsg } from "../services/event-bus.service"
// import { DogPreview } from "./DogPreview"
// import trash from '../assets/imgs/icons/trash.svg'

// export function StayList({ filterBy }) {
//     const [allStays, setAllStays] = useState([])  // all stays
//     const [stays, setStays] = useState([])        // filtered stays
//     const [loading, setLoading] = useState(true)
//     const [stayToRemove, setStayToRemove] = useState(null)

//     useEffect(() => {
//         loadStays()
//     }, [])

//     useEffect(() => {
//         applyFilter()
//     }, [filterBy, allStays])

//     async function loadStays() {
//         try {
//             setLoading(true)
//             const all = await stayService.query()
//             const now = new Date()
//             const active = all.filter(stay => new Date(stay.endDate) >= now)

//             const withDogs = await Promise.all(
//                 active.map(async stay => {
//                     const dog = await dogService.getById(stay.dogId)
//                     return { ...stay, dog }
//                 })
//             )

//             withDogs.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
//             setAllStays(withDogs)
//             setStays(withDogs) // initial display
//         } catch (err) {
//             console.error('Error loading stays:', err)
//             showErrorMsg('שגיאה בטעינת שהיות')
//         } finally {
//             setLoading(false)
//         }
//     }

//     function applyFilter() {
//         if (!filterBy?.txt) {
//             setStays(allStays)
//             return
//         }

//         const txt = filterBy.txt.toLowerCase()
//         const filtered = allStays.filter(stay =>
//             stay.dog.name.toLowerCase().includes(txt) ||
//             stay.dog.breed?.toLowerCase().includes(txt) ||
//             stay.dog.chip?.toString().includes(txt)
//         )
//         setStays(filtered)
//     }

//     function confirmRemove(stayId) {
//         setStayToRemove(stayId)
//     }

//     async function handleRemove() {
//         if (!stayToRemove) return
//         try {
//             await stayService.remove(stayToRemove)
//             setAllStays(prev => prev.filter(stay => stay._id !== stayToRemove))
//             setStays(prev => prev.filter(stay => stay._id !== stayToRemove))
//         } catch (err) {
//             console.error('Cannot remove stay:', err)
//             showErrorMsg('שגיאה במחיקת השהייה')
//         } finally {
//             setStayToRemove(null)
//         }
//     }

//     function closeModal() {
//         setStayToRemove(null)
//     }

//     if (loading) return <p>טוען שהיות...</p>
//     if (!stays.length) return <p>אין כלבים שנמצאים או עתידים להגיע 🐾</p>

//     return (
//         <section>
//             <ul className="list">
//                 {stays.map(stay => (
//                     <li key={stay._id}>
//                         <div className="dog-preview-wrapper">
//                             <DogPreview dog={stay.dog} />
//                             <div
//                                 className={`stay-info ${
//                                     new Date(stay.startDate) <= new Date() &&
//                                     new Date(stay.endDate) >= new Date()
//                                         ? 'currently-staying'
//                                         : ''
//                                 }`}
//                             >
//                                 <p>מתאריך: {new Date(stay.startDate).toLocaleDateString('he-IL')}</p>
//                                 <p>עד תאריך: {new Date(stay.endDate).toLocaleDateString('he-IL')}</p>
//                                 <p>סה"כ ימים: {stay.days}</p>
//                                 <p>מחיר: {stay.price} ש"ח</p>
//                             </div>
//                         </div>
//                         <button onClick={() => confirmRemove(stay._id)}>
//                             <img src={trash} alt="delete stay" />
//                         </button>
//                     </li>
//                 ))}
//             </ul>

//             {stayToRemove && (
//                 <div className="modal-overlay">
//                     <div className="modal">
//                         <p>בטוח שברצונך למחוק את השהייה?</p>
//                         <div className="actions">
//                             <button onClick={handleRemove}>כן</button>
//                             <button onClick={closeModal}>לא</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </section>
//     )
// }


import { useEffect, useState } from "react"
import { stayService } from "../services/stay.service"
import { dogService } from "../services/dog"
import { showErrorMsg } from "../services/event-bus.service"
import { DogPreview } from "./DogPreview"
import trash from '../assets/imgs/icons/trash.svg'

export function StayList({ filterBy }) {
    const [allStays, setAllStays] = useState([])  // all stays
    const [stays, setStays] = useState([])        // filtered stays
    const [loading, setLoading] = useState(true)
    const [stayToRemove, setStayToRemove] = useState(null)

    useEffect(() => {
        loadStays()
    }, [])

    useEffect(() => {
        applyFilter()
    }, [filterBy, allStays])

    async function loadStays() {
        try {
            setLoading(true)
            const all = await stayService.query()
            const now = new Date()
            const active = all.filter(stay => new Date(stay.endDate) >= now)

            const withDogs = await Promise.all(
                active.map(async stay => {
                    const dog = await dogService.getById(stay.dogId)
                    return { ...stay, dog }
                })
            )

            withDogs.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
            setAllStays(withDogs)
            setStays(withDogs) // initial display
        } catch (err) {
            console.error('Error loading stays:', err)
            showErrorMsg('שגיאה בטעינת שהיות')
        } finally {
            setLoading(false)
        }
    }

    function applyFilter() {
        if (!filterBy?.txt) {
            setStays(allStays)
            return
        }

        const txt = filterBy.txt.toLowerCase()
        const filtered = allStays.filter(stay =>
            stay.dog.name.toLowerCase().includes(txt) ||
            stay.dog.breed?.toLowerCase().includes(txt) ||
            stay.dog.chip?.toString().includes(txt)
        )
        setStays(filtered)
    }

    function confirmRemove(stayId) {
        setStayToRemove(stayId)
    }

    async function handleRemove() {
        if (!stayToRemove) return
        try {
            await stayService.remove(stayToRemove)
            setAllStays(prev => prev.filter(stay => stay._id !== stayToRemove))
            setStays(prev => prev.filter(stay => stay._id !== stayToRemove))
        } catch (err) {
            console.error('Cannot remove stay:', err)
            showErrorMsg('שגיאה במחיקת השהייה')
        } finally {
            setStayToRemove(null)
        }
    }

    function closeModal() {
        setStayToRemove(null)
    }

    // ----- NEW: compute dogs leaving today / tomorrow -----
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    function isSameDay(dateA, dateB) {
        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        )
    }

    const leavingToday = stays.filter(stay =>
        isSameDay(new Date(stay.endDate), today)
    )

    const leavingTomorrow = stays.filter(stay =>
        isSameDay(new Date(stay.endDate), tomorrow)
    )
    // -------------------------------------------------------

    if (loading) return <p>טוען שהיות...</p>
    if (!stays.length) return <p>אין כלבים שנמצאים או עתידים להגיע 🐾</p>

    return (
        <section className="stay-list">
            {/* 🔼 NEW SUMMARY SECTION */}
            <section className="leaving-soon">
                <div className="leaving-column">
                    <h3>עוזבים היום</h3>
                    {leavingToday.length ? (
                        <ul>
                            {leavingToday.map(stay => (
                                <li key={stay._id}>
                                    {stay.dog?.name || 'כלב ללא שם'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין כלבים שעוזבים היום</p>
                    )}
                </div>

                <div className="leaving-column">
                    <h3>עוזבים מחר</h3>
                    {leavingTomorrow.length ? (
                        <ul>
                            {leavingTomorrow.map(stay => (
                                <li key={stay._id}>
                                    <p>
                                        {stay.dog?.name || 'כלב ללא שם'}
                                    </p>
                                    <p>
                                    - {stay.dog?.ownerName || 'אין שם לבעלים'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין כלבים שעוזבים מחר</p>
                    )}
                </div>
            </section>

            {/* 🔽 EXISTING LIST */}
            <ul className="list">
                {stays.map(stay => (
                    <li key={stay._id}>
                        <div className="dog-preview-wrapper">
                            <DogPreview dog={stay.dog} />
                            <div
                                className={`stay-info ${new Date(stay.startDate) <= new Date() &&
                                    new Date(stay.endDate) >= new Date()
                                    ? 'currently-staying'
                                    : ''
                                    }`}
                            >
                                <p>מתאריך: {new Date(stay.startDate).toLocaleDateString('he-IL')}</p>
                                <p>עד תאריך: {new Date(stay.endDate).toLocaleDateString('he-IL')}</p>
                                <p>סה"כ ימים: {stay.days}</p>
                                <p>מחיר: {stay.price} ש"ח</p>
                            </div>
                        </div>
                        <button onClick={() => confirmRemove(stay._id)}>
                            <img src={trash} alt="delete stay" />
                        </button>
                    </li>
                ))}
            </ul>

            {stayToRemove && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>בטוח שברצונך למחוק את השהייה?</p>
                        <div className="actions">
                            <button onClick={handleRemove}>כן</button>
                            <button onClick={closeModal}>לא</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
