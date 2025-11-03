import { useEffect, useState } from "react"
import { stayService } from "../services/stay.service"
import { dogService } from "../services/dog"
import { showErrorMsg } from "../services/event-bus.service"
import { DogPreview } from "./DogPreview"
import trash from '../assets/imgs/icons/trash.svg'

export function StayList() {
    const [stays, setStays] = useState([])
    const [loading, setLoading] = useState(true)
    const [stayToRemove, setStayToRemove] = useState(null)

    useEffect(() => {
        loadStays()
    }, [])

    async function loadStays() {
        try {
            setLoading(true)
            const allStays = await stayService.query()
            const now = new Date()

            // Filter to current or future stays
            const active = allStays.filter(stay => new Date(stay.endDate) >= now)

            // Enrich stays with dog data
            const staysWithDogs = await Promise.all(
                active.map(async stay => {
                    const dog = await dogService.getById(stay.dogId)
                    return { ...stay, dog }
                })
            )

            // Sort by soonest end date
            staysWithDogs.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
            setStays(staysWithDogs)
        } catch (err) {
            console.error('Error loading stays:', err)
            showErrorMsg('שגיאה בטעינת שהיות')
        } finally {
            setLoading(false)
        }
    }

    function confirmRemove(stayId) {
        setStayToRemove(stayId)
    }

    async function handleRemove() {
        if (!stayToRemove) return

        try {
            await stayService.remove(stayToRemove)
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

    if (loading) return <p>טוען שהיות...</p>
    if (!stays.length) return <p>אין כלבים שנמצאים או עתידים להגיע 🐾</p>

    return (
        <section>
            <ul className="list">
                {stays.map(stay => (
                    <li key={stay._id}>
                        <div className="dog-preview-wrapper">
                            <DogPreview dog={stay.dog} />

                            <div className="stay-info">
                                <p> מתאריך: {new Date(stay.startDate).toLocaleDateString('he-IL')}</p>
                                <p> עד תאריך: {new Date(stay.endDate).toLocaleDateString('he-IL')}</p>
                                <p> סה"כ ימים: {stay.days}</p>
                                <p> מחיר: {stay.price} ש"ח</p>
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
