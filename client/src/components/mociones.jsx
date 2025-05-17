import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../server/commons/firebase.js'
import Swal from 'sweetalert2'

function Mociones({ votoId, mocionPath }) {
  const [mociones, setMociones] = useState([])
  const [votos, setVotos] = useState({}) // { mocionId: "voto seleccionado" }

  // Cargar todas las mociones para la asamblea
  useEffect(() => {
    if (!mocionPath?.asambleaId) return

    const fetchMociones = async () => {
      try {
        const mocionesCol = collection(db, 'ASAMBLEAS', mocionPath.asambleaId, 'MOCIONES')
        const mocionesSnap = await getDocs(mocionesCol)
        const mocionesList = mocionesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMociones(mocionesList)
      } catch (error) {
        console.error('Error cargando mociones:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las mociones.',
        })
      }
    }

    fetchMociones()
  }, [mocionPath])

  // Manejar cambio de voto por mocion
  const handleVoteChange = (mocionId, opcion) => {
    setVotos(prev => ({ ...prev, [mocionId]: opcion }))
  }

  // Enviar voto para una mocion específica
  const handleSubmit = async (mocionId) => {
    const votoSeleccionado = votos[mocionId]
    if (!votoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: 'Por favor, selecciona una opción antes de enviar.',
      })
      return
    }

    try {
      const votoRef = doc(db, 'ASAMBLEAS', mocionPath.asambleaId, 'MOCIONES', mocionId, 'VOTOS', votoId)
      await updateDoc(votoRef, {
        voto: votoSeleccionado,
        fecha_voto: new Date()
      })
      Swal.fire({
        icon: 'success',
        title: '¡Voto guardado!',
        text: `Tu voto "${votoSeleccionado}" en la moción se guardó correctamente.`,
      })
    } catch (error) {
      console.error('Error guardando voto:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar tu voto. Intenta de nuevo.',
      })
    }
  }

  return (
  <div className="container">
    <h3 className="text-center">Mociones</h3>
    {mociones.length === 0 && <p>Cargando mociones...</p>}
    {mociones.map(({ id, MocionAprobacion, MocionRechazo, MocionSuspencion, op1, op2, op3 }) => (
      <div key={id} className="mb-4 border p-3 rounded">
        {/* Moción Aprobación */}
        <h4>{MocionAprobacion}</h4>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-aprobacion-${id}`}
            id={`${id}-aprobacion-op1`}
            checked={votos[`${id}-aprobacion`] === op1}
            onChange={() => handleVoteChange(`${id}-aprobacion`, op1)}
          />
          <label className="form-check-label" htmlFor={`${id}-aprobacion-op1`}>{op1}</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-aprobacion-${id}`}
            id={`${id}-aprobacion-op2`}
            checked={votos[`${id}-aprobacion`] === op2}
            onChange={() => handleVoteChange(`${id}-aprobacion`, op2)}
          />
          <label className="form-check-label" htmlFor={`${id}-aprobacion-op2`}>{op2}</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-aprobacion-${id}`}
            id={`${id}-aprobacion-op3`}
            checked={votos[`${id}-aprobacion`] === op3}
            onChange={() => handleVoteChange(`${id}-aprobacion`, op3)}
          />
          <label className="form-check-label" htmlFor={`${id}-aprobacion-op3`}>{op3}</label>
        </div>
        <button className="btn btn-primary mt-2" onClick={() => handleSubmit(`${id}-aprobacion`)}>Enviar voto</button>

        {/* Moción Rechazo */}
        <h4 className="mt-4">{MocionRechazo}</h4>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-rechazo-${id}`}
            id={`${id}-rechazo-op1`}
            checked={votos[`${id}-rechazo`] === op1}
            onChange={() => handleVoteChange(`${id}-rechazo`, op1)}
          />
          <label className="form-check-label" htmlFor={`${id}-rechazo-op1`}>{op1}</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-rechazo-${id}`}
            id={`${id}-rechazo-op2`}
            checked={votos[`${id}-rechazo`] === op2}
            onChange={() => handleVoteChange(`${id}-rechazo`, op2)}
          />
          <label className="form-check-label" htmlFor={`${id}-rechazo-op2`}>{op2}</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-rechazo-${id}`}
            id={`${id}-rechazo-op3`}
            checked={votos[`${id}-rechazo`] === op3}
            onChange={() => handleVoteChange(`${id}-rechazo`, op3)}
          />
          <label className="form-check-label" htmlFor={`${id}-rechazo-op3`}>{op3}</label>
        </div>
        <button className="btn btn-primary mt-2" onClick={() => handleSubmit(`${id}-rechazo`)}>Enviar voto</button>

        {/* Moción Suspención */}
        <h4 className="mt-4">{MocionSuspencion}</h4>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-suspencion-${id}`}
            id={`${id}-suspencion-op1`}
            checked={votos[`${id}-suspencion`] === op1}
            onChange={() => handleVoteChange(`${id}-suspencion`, op1)}
          />
          <label className="form-check-label" htmlFor={`${id}-suspencion-op1`}>{op1}</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-suspencion-${id}`}
            id={`${id}-suspencion-op2`}
            checked={votos[`${id}-suspencion`] === op2}
            onChange={() => handleVoteChange(`${id}-suspencion`, op2)}
          />
          <label className="form-check-label" htmlFor={`${id}-suspencion-op2`}>{op2}</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`radio-suspencion-${id}`}
            id={`${id}-suspencion-op3`}
            checked={votos[`${id}-suspencion`] === op3}
            onChange={() => handleVoteChange(`${id}-suspencion`, op3)}
          />
          <label className="form-check-label" htmlFor={`${id}-suspencion-op3`}>{op3}</label>
        </div>
        <button className="btn btn-primary mt-2" onClick={() => handleSubmit(`${id}-suspencion`)}>Enviar voto</button>
      </div>
    ))}
  </div>
)
}

export default Mociones
