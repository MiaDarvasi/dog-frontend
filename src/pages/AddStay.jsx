import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { showErrorMsg } from '../services/event-bus.service'
import { dogService } from '../services/dog'
import { stayService } from '../services/stay.service'

import arrow from '../assets/imgs/icons/arrow_white.svg'


export function AddStay() {
    const { dogId } = useParams()
    const [dog, setDog] = useState(null)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        if (!dogId) return
        (async () => {
            try {
                const d = await dogService.getById(dogId)
                setDog(d)
            } catch (err) {
                showErrorMsg('Cannot load dog')
            }
        })()
    }, [dogId])


    function calcDays(s, e) {
        const sd = new Date(s)
        const ed = new Date(e)
        const msPerDay = 1000 * 60 * 60 * 24
        if (isNaN(sd) || isNaN(ed)) return 0
        return Math.max(1, Math.ceil((ed - sd) / msPerDay) + 1)
    }


    async function onSave(ev) {
        ev.preventDefault()
        try {
            const days = calcDays(startDate, endDate)
            const res = await stayService.addStay({ dogId, startDate, endDate })
            showSuccessMsg(`שהייה נשמרה — סה"כ ${res.price} ש"ח (${res.days} ימים)`)
            navigate('/')
        } catch (err) {
            navigate('/')
            // showErrorMsg('שגיאה בשמירת שהייה')
        }
    }


    if (!dog) return <p>טוען כלב...</p>


    const estDays = (startDate && endDate) ? calcDays(startDate, endDate) : 0
    const estPrice = estDays * (Number(dog.pricePerDay) || 0)


    return (
        <section className="add-stay" dir="rtl">
            <h1>מתי {dog.name} {dog.gender === 'male' ? 'מגיע' : 'מגיעה'} ?</h1>
            <form onSubmit={onSave}>
                <label>
                    תאריך התחלה:
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                </label>


                <label>
                    תאריך סיום:
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                </label>


                <p>מחיר ליום: {dog.pricePerDay || 0} ש"ח</p>
                <p>ימים משוערים: {estDays}</p>
                <p>מחיר משוער: {estPrice} ש"ח</p>


                <button type="submit">שמור</button>

            </form>
            
            <button onClick={() => navigate("/")} className="cancel">
                <img src={arrow} />
            </button>
        </section>
    )
}