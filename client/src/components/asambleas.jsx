import {  useState } from 'react'
import Mociones from '../components/mociones.jsx'

function Asambleas() {
    const [showMociones, setShowMociones] = useState(false);
    const handleClick = () => {
        setShowMociones(!showMociones);
    }

    if (showMociones) {
        return <Mociones />
    }

    return (
        <div className="card" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">Nombre de la asamblea*</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">proveedor*</h6>
                <p className="card-text">Descripcion*</p>
                <button type="button" class="btn btn-outline-dark" onClick={()=>handleClick()}>Detalles</button>

                
            </div>
        </div>
    )
}

export default Asambleas
