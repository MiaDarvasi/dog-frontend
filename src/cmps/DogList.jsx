import { useState } from 'react'
import { DogPreview } from './DogPreview'
import trash from '../assets/imgs/icons/trash.svg'

export function DogList({ dogs, onRemoveDog, onUpdateDog }) {
    const [dogToRemove, setDogToRemove] = useState(null)

    function confirmRemove(dogId) {
        setDogToRemove(dogId)
    }

    function handleRemove() {
        if (dogToRemove) onRemoveDog(dogToRemove)
        setDogToRemove(null)
    }

    function closeModal() {
        setDogToRemove(null)
    }

    return (
        <section>
            <ul className="list">
                {dogs.map(dog =>
                    <li key={dog._id}>
                        <DogPreview dog={dog} />
                        <button className='delete-dog'
                        onClick={() => confirmRemove(dog._id)}>
                            <img src={trash} alt="delete" />
                        </button>
                    </li>
                )}
            </ul>

            {dogToRemove && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>סגור על זה?</p>
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
