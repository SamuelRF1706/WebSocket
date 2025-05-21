import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../server/commons/firebase.js'
import { io } from 'socket.io-client'
import Swal from 'sweetalert2'
const socket = io('http://localhost:5000')


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
    // Determinar el índice de la moción en la lista para asignar RM1, RM2, RM3
    const index = mociones.findIndex(mocion => mocion.id === mocionId)
    const campoVoto = `RM${index + 1}`
    const campoFecha = `fecha_RM${index + 1}`

    const votoRef = doc(db, 'ASAMBLEAS', mocionPath.asambleaId, 'VOTOS_PARTICIPANTES', votoId)

    await updateDoc(votoRef, {
      [campoVoto]: votoSeleccionado,
      [campoFecha]: new Date()
    })

    // 🔁 Emitimos al servidor para que recalcule y envíe el nuevo conteo
    socket.emit('nuevo-voto-guardado', { asambleaId: mocionPath.asambleaId })

    Swal.fire({
      icon: 'success',
      title: '¡Voto guardado!',
      text: `Tu voto "${votoSeleccionado}" se guardó exitosamente.`,
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
    <div className="container py-5">
      <h2 className="text-center mb-5 text-primary fw-bold">Mociones de Asamblea</h2>

      {mociones.length === 0 && (
        <p className="text-center text-muted">Cargando mociones...</p>
      )}

      <div className="row justify-content-center">
        {mociones.map(({ id, MocionConfianza, MocionAprobacion, MocionSuspencion, op1, op2, op3 }) => (
          <div key={id} className="col-md-8 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="card-title fw-bold mb-3 text-dark">
                  {MocionAprobacion} {MocionConfianza} {MocionSuspencion}
                </h4>

                <div className="mb-3">
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
                </div>

                <div className="mb-3">
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

                </div>
                <div className="mb-3">
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
                </div>

                <button
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={() => handleSubmit(id)}
                >
                  Enviar voto
                </button>
              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  )
}

export default Mociones
