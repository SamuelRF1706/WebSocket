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
          <h4>{MocionAprobacion}</h4>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={`radio-${id}`}
              id={`${id}-op1`}
              checked={votos[id] === op1}
              onChange={() => handleVoteChange(id, op1)}
            />
            <label className="form-check-label" htmlFor={`${id}-op1`}>{op1}</label>
          </div>

          <h4>{MocionRechazo}</h4>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={`radio-${id}`}
              id={`${id}-op2`}
              checked={votos[id] === op2}
              onChange={() => handleVoteChange(id, op2)}
            />
            <label className="form-check-label" htmlFor={`${id}-op2`}>{op2}</label>
          </div>

          <h4>{MocionSuspencion}</h4>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={`radio-${id}`}
              id={`${id}-op3`}
              checked={votos[id] === op3}
              onChange={() => handleVoteChange(id, op3)}
            />
            <label className="form-check-label" htmlFor={`${id}-op3`}>{op3}</label>
          </div>

          <button className="btn btn-primary mt-2" onClick={() => handleSubmit(id)}>Enviar voto</button>
        </div>
      ))}
    </div>
  )
}

export default Mociones
