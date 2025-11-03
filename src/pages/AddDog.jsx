import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { addDog, updateDog } from "../store/actions/dog.actions"
import { dogService } from "../services/dog"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"

import paw from '../assets/imgs/icons/paw_orange_full.svg'
import arrow from '../assets/imgs/icons/arrow_white.svg'

export function AddDog() {
  const [dog, setDog] = useState(dogService.getEmptyDog())
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()
  const { dogId } = useParams()

  useEffect(() => {
    async function loadDog() {
      if (dogId) {
        try {
          const dogToEdit = await dogService.getById(dogId)
          setDog(dogToEdit)
        } catch (err) {
          showErrorMsg("לא ניתן לטעון כלב")
        }
      }
      setIsLoading(false)
    }
    loadDog()
  }, [dogId])

  function handleChange(ev) {
    const { name, value, type } = ev.target

    setDog(prev => {
      let val = value

      // Convert numeric inputs to numbers
      if (type === 'number') val = +value || 0

      return { ...prev, [name]: val }
    })
  }

  async function onSaveDog(ev) {
    ev.preventDefault()
    try {
      // Ensure all optional fields are defined before sending to backend
      const dogToSave = {
        ...dog,
        name: dog.name || '',
        gender: dog.gender || '',
        chip: dog.chip || '',
        breed: dog.breed || '',
        age: +dog.age || 0,
        castrated: dog.castrated || '',
        ownerName: dog.ownerName || '',
        ownerPhone: dog.ownerPhone || '',
        pricePerDay: +dog.pricePerDay || 150,
        haircutPrice: +dog.haircutPrice || 0,
        equipment: dog.equipment || '',
        equipmentLoc: dog.equipmentLoc || '',
        med: dog.med || '',
        specialFood: dog.specialFood || '',
        collarColor: dog.collarColor || '',
        ourNum: dog.ourNum || '',
        notes: dog.notes || '',
      }

      const savedDog = dog._id
        ? await updateDog(dogToSave)
        : await addDog(dogToSave)

      // showSuccessMsg(`${savedDog.name} נשמר בהצלחה ✅`)
      navigate("/")
    } catch (err) {
      console.error('Cannot save dog:', err)
      showErrorMsg("שגיאה בשמירת כלב")
    }
  }

  if (isLoading) return <p>טוען...</p>

  return (
    <section className="add-dog" dir="rtl">
      <h1><img src={paw} />{dog._id ? "עריכת פרטי כלב" : "הוספת כלב חדש"}</h1>

      <form onSubmit={onSaveDog} className="dog-form">
        {/* --- Basic fields --- */}
        <label>שם הכלב :
          <input type="text" name="name" value={dog.name} onChange={handleChange} required />
        </label>

        <label>מין :
          <div className="gender-options radio-options">
            <label className="radio-label">
              <input type="radio" name="gender" value="male" checked={dog.gender === "male"} onChange={handleChange} /> זכר
            </label>
            <label className="radio-label">
              <input type="radio" name="gender" value="female" checked={dog.gender === "female"} onChange={handleChange} /> נקבה
            </label>
          </div>
        </label>

        <label>מספר צ׳יפ :
          <input type="text" name="chip" value={dog.chip} onChange={handleChange} required />
        </label>

        <label>סוג הכלב :
          <input type="text" name="breed" value={dog.breed} onChange={handleChange} required />
        </label>

        <label>גיל :
          <input type="number" name="age" value={dog.age} onChange={handleChange} required />
        </label>

        <label>מסורס / מעוקרת :
          <div className="castrated-options radio-options">
            <label className="radio-label">
              <input type="radio" name="castrated" value="yes" checked={dog.castrated === "yes"} onChange={handleChange} /> כן
            </label>
            <label className="radio-label">
              <input type="radio" name="castrated" value="no" checked={dog.castrated === "no"} onChange={handleChange} /> לא
            </label>
          </div>
        </label>

        <label>שם הבעלים :
          <input type="text" name="ownerName" value={dog.ownerName} onChange={handleChange} />
        </label>

        <label>טלפון בעלים :
          <input type="tel" name="ownerPhone" value={dog.ownerPhone} onChange={handleChange} />
        </label>

        {/* --- Prices --- */}
        <label>מחיר ליום:
          <input type="number" name="pricePerDay" value={dog.pricePerDay} onChange={handleChange} required />
        </label>

        <label>מחיר תספורת:
          <input type="number" name="haircutPrice" value={dog.haircutPrice} onChange={handleChange} />
        </label>

        {/* --- Optional info --- */}
        <label>ציוד שהביא :
          <input type="text" name="equipment" value={dog.equipment} onChange={handleChange} />
        </label>

        <label>מיקום ציוד :
          <input type="text" name="equipmentLoc" value={dog.equipmentLoc} onChange={handleChange} />
        </label>

        <label>תרופות :
          <input type="text" name="med" value={dog.med} onChange={handleChange} />
        </label>

        <label>אוכל מיוחד :
          <input type="text" name="specialFood" value={dog.specialFood} onChange={handleChange} />
        </label>

        <label>צבע קולר :
          <input type="text" name="collarColor" value={dog.collarColor} onChange={handleChange} />
        </label>

        <label>מספר של פנסיון :
          <input type="text" name="ourNum" value={dog.ourNum} onChange={handleChange} />
        </label>

        <label>הערות:
          <input type="text" name="notes" value={dog.notes} onChange={handleChange} />
        </label>

        <button type="submit">{dog._id ? "עדכן כלב" : "שמור כלב"}</button>
      </form>

      <button onClick={() => navigate("/")} className="cancel">
        <img src={arrow} />
      </button>
    </section>
  )
}
