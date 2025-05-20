import { useEffect, useState } from 'react'
import './App.css'
import Asambleas from './components/asambleas'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

import { getDocs, collection, addDoc } from 'firebase/firestore'
import { db } from '../../server/commons/firebase'

const socket = io('http://localhost:5000')

function App() {
  const [mensaje, setMensaje] = useState({ name: '', message: '' })
  const [votoDocPath, setVotoDocPath] = useState(null) // Guardamos la ruta completa

  useEffect(() => {
    const identificarYGuardarUsuario = async () => {
      const result = await Swal.fire({
        icon: 'question',
        title: 'Identifícate',
        input: 'text',
        inputLabel: 'Escribe tu nombre',
        inputValue: '',
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
          if (!value) return 'Debes escribir un nombre'
        }
      })

      const nombre = result.value
      setMensaje(prev => ({ ...prev, name: nombre }))

      // Obtener ASAMBLEA y MOCIÓN
      const asambleasSnap = await getDocs(collection(db, 'ASAMBLEAS'))
      const asambleaDoc = asambleasSnap.docs[0]
      const asambleaId = asambleaDoc.id

      const mocionesSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES'))
      const mocionDoc = mocionesSnap.docs[0]
      const mocionId = mocionDoc.id

      // Crear VOTO con ID automático
      const votoRef = await addDoc(collection(db, 'ASAMBLEAS', asambleaId, 'VOTOS_PARTICIPANTES'), {
        nombre
      })

      // Guardar la ruta para luego actualizar
      setVotoDocPath({
        asambleaId,
        mocionId,
        votoId: votoRef.id
      })
    }

    identificarYGuardarUsuario()
  }, [])

  return (
    <div className="container mt-5">
      <Asambleas votoDocPath={votoDocPath} nombreUsuario={mensaje.name} />
      

      
    </div>
  )
}

export default App
