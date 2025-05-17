import { useEffect, useState } from 'react'
import './App.css'
import Asambleas from './components/asambleas'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

import { getDocs, collection, addDoc } from 'firebase/firestore'
import { db } from '../../server/commons/firebase'

const socket = io('http://localhost:5000')

function App() {
  const [mensaje, setMensaje] = useState({ name: '', message: '' });
  const [userId, setUserId] = useState('');

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
          if (!value) return 'Debes escribir un nombre';
        }
      });

      const nombre = result.value;
      setMensaje(prev => ({ ...prev, name: nombre }));
      setUserId(nombre); 

      // Obtener la primera ASAMBLEA
      const asambleasSnap = await getDocs(collection(db, 'ASAMBLEAS'));
      const asambleaDoc = asambleasSnap.docs[0];
      if (!asambleaDoc) {
        console.error('No hay asambleas registradas');
        return;
      }

      const asambleaId = asambleaDoc.id;

      // Obtener la primera MOCIÓN dentro de la ASAMBLEA
      const mocionesSnap = await getDocs(collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES'));
      const mocionDoc = mocionesSnap.docs[0];
      if (!mocionDoc) {
        console.error('No hay mociones registradas en esta asamblea');
        return;
      }

      const mocionId = mocionDoc.id;

      // Agregar un nuevo voto con ID automático
      await addDoc(collection(db, 'ASAMBLEAS', asambleaId, 'MOCIONES', mocionId, 'Votos'), {
        nombre: nombre
      });

      console.log(`Nombre "${nombre}" guardado en VOTOS`);
    };

    identificarYGuardarUsuario();
  }, []);

  return (
    <div className="container mt-5">
      <Asambleas/>
    </div>
  );
}

export default App;
