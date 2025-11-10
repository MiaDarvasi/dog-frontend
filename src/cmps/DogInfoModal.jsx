// src/cmps/DogInfoModal.jsx
import dogimg from '../assets/imgs/icons/dog.svg'
import num from '../assets/imgs/icons/num.svg'
import male from '../assets/imgs/icons/male.svg'
import female from '../assets/imgs/icons/female.svg'
import warning from '../assets/imgs/icons/warning.svg'
import calendar from '../assets/imgs/icons/calendar.svg'
import phone from '../assets/imgs/icons/phone.svg'
import person from '../assets/imgs/icons/person.svg'
import price from '../assets/imgs/icons/price.svg'
import city from '../assets/imgs/icons/city.svg'
import grass from '../assets/imgs/icons/grass.svg'

export function DogInfoModal({ dog, onClose }) {
    if (!dog) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="info-modal" onClick={e => e.stopPropagation()}>
                <section>
                    <img className='main-dog-img' src={dog.imgUrl ? dog.imgUrl : dogimg} alt="dog icon" />
                    <article>
                        <p><strong>שם:</strong> {dog.name}</p>
                        <p><strong>גזע:</strong> {dog.breed || 'לא צוין'}</p>
                    </article>
                </section>

                <p><img src={dog.gender === 'female' ? female : male} /><strong>מין:</strong> {dog.gender === 'female' ? 'נקבה' : 'זכר'}</p>
                <p><img src={calendar} /><strong>גיל:</strong> {dog.age}</p>
                <p><img src={grass} /><strong>חצר:</strong> {dog.size === 'big' ? 'גדולים' : dog.size === 'small' ? 'קטנים' : '-'}</p>
                <p><img src={num} /><strong>מספר צ׳יפ:</strong> {dog.chip}</p>
                <p><img src={person} /><strong>שם בעלים:</strong> {dog.ownerName}</p>
                <p>
                    <img src={phone} />
                    <strong>טלפון בעלים:</strong>{' '}
                    <a href={`tel:${dog.ownerPhone}`}>{dog.ownerPhone}</a>
                </p>
                <p><img src={city} /><strong>עיר:</strong> {dog.city || 'לא צוין'}</p>
                <p><img src={price} /><strong>מחיר ליום:</strong> {dog.pricePerDay}</p>
                <p><img src={price} /><strong>מחיר תספורת:</strong> {dog.haircutPrice}</p>
                <hr />
                <p><strong>ציוד שהביא:</strong> {dog.equipment}</p>
                <p><strong>מיקום ציוד:</strong> {dog.equipmentLoc}</p>
                <p><strong>תרופות:</strong> {dog.med}</p>
                <p><strong>אוכל מיוחד:</strong> {dog.specialFood}</p>
                <p><strong>צבע קולר:</strong> {dog.collarColor}</p>
                <p><strong>מספר פנסיון:</strong> {dog.ourNum}</p>
                <p><strong>הערות:</strong> {dog.notes}</p>
            </div>
        </div>
    )
}
