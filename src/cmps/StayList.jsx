import { useEffect, useState } from "react"
import { stayService } from "../services/stay.service"
import { dogService } from "../services/dog"
import { showErrorMsg } from "../services/event-bus.service"
import { DogPreview } from "./DogPreview"
import trash from '../assets/imgs/icons/trash.svg'

export function StayList({ filterBy }) {
    const [allStays, setAllStays] = useState([])  // all active stays (for search)
    const [stays, setStays] = useState([])        // filtered stays to display
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

            // Normalize "today" to start of day (00:00:00)
            const todayStart = new Date()
            todayStart.setHours(0, 0, 0, 0)

            // Keep stays whose endDate is today or later
            const active = all.filter(stay => {
                const end = new Date(stay.endDate)
                return end >= todayStart
            })

            const withDogs = await Promise.all(
                active.map(async stay => {
                    const dog = await dogService.getById(stay.dogId)
                    return { ...stay, dog }
                })
            )

            // Sort by end date (earliest leaving first)
            withDogs.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))

            setAllStays(withDogs)
            setStays(withDogs)
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

    // ---------- DATE HELPERS & SUMMARY LISTS ----------

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    function normalizeToStartOfDay(date) {
        const d = new Date(date)
        return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }

    function isSameDay(dateA, dateB) {
        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        )
    }

    // Normalize stays once for summary calculations
    const normalizedStays = stays.map(stay => {
        const startNorm = normalizeToStartOfDay(stay.startDate)
        const endNorm = normalizeToStartOfDay(stay.endDate)
        return { ...stay, _start: startNorm, _end: endNorm }
    })

    // Arrivals (based on startDate)
    const arrivingToday = normalizedStays.filter(stay =>
        isSameDay(stay._start, todayStart)
    )

    const arrivingTomorrow = normalizedStays.filter(stay =>
        isSameDay(stay._start, tomorrowStart)
    )

    // Departures (based on endDate)
    const leavingToday = normalizedStays.filter(stay =>
        isSameDay(stay._end, todayStart)
    )

    const leavingTomorrow = normalizedStays.filter(stay =>
        isSameDay(stay._end, tomorrowStart)
    )

    // Class for each stay card
    function getStayClass(stay) {
        const startNorm = normalizeToStartOfDay(stay.startDate)
        const endNorm = normalizeToStartOfDay(stay.endDate)

        if (isSameDay(endNorm, todayStart)) return 'leaving-today'
        if (startNorm <= todayStart && endNorm >= todayStart) return 'currently-staying'
        return ''
    }

    // ---------- RENDER ----------

    if (loading) return <p>טוען שהיות...</p>
    if (!stays.length) return <p>אין כלבים שנמצאים או עתידים להגיע 🐾</p>

    return (
        <section className="stay-list">
            {/* SUMMARY SECTION: ARRIVALS + DEPARTURES */}
            <section className="leaving-arriving">
                <div className="summary-column">
                    <h3>מגיעים היום</h3>
                    {arrivingToday.length ? (
                        <ul>
                            {arrivingToday.map(stay => (
                                <li key={stay._id}>
                                    <p>{stay.dog?.name || 'כלב ללא שם'}</p>
                                    <p>- {stay.dog?.ownerName || 'אין שם לבעלים'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין כלבים שמגיעים היום</p>
                    )}
                </div>

                <div className="summary-column">
                    <h3>מגיעים מחר</h3>
                    {arrivingTomorrow.length ? (
                        <ul>
                            {arrivingTomorrow.map(stay => (
                                <li key={stay._id}>
                                    <p>{stay.dog?.name || 'כלב ללא שם'}</p>
                                    <p>- {stay.dog?.ownerName || 'אין שם לבעלים'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין כלבים שמגיעים מחר</p>
                    )}
                </div>

                <div className="summary-column">
                    <h3>עוזבים היום</h3>
                    {leavingToday.length ? (
                        <ul>
                            {leavingToday.map(stay => (
                                <li key={stay._id}>
                                    <p>{stay.dog?.name || 'כלב ללא שם'}</p>
                                    <p>- {stay.dog?.ownerName || 'אין שם לבעלים'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין כלבים שעוזבים היום</p>
                    )}
                </div>

                <div className="summary-column">
                    <h3>עוזבים מחר</h3>
                    {leavingTomorrow.length ? (
                        <ul>
                            {leavingTomorrow.map(stay => (
                                <li key={stay._id}>
                                    <p>{stay.dog?.name || 'כלב ללא שם'}</p>
                                    <p>- {stay.dog?.ownerName || 'אין שם לבעלים'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין כלבים שעוזבים מחר</p>
                    )}
                </div>
            </section>

            {/* MAIN STAY LIST */}
            <ul className="list">
                {stays.map(stay => (
                    <li key={stay._id}>
                        <div className="dog-preview-wrapper">
                            <DogPreview dog={stay.dog} />
                            <div className={`stay-info ${getStayClass(stay)}`}>
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
