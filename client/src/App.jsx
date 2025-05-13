import { useEffect, useState } from 'react'
import './App.css'
import Asambleas from './components/asambleas'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

const socket = io('http://localhost:5000')

function App() {

  const [mensaje, setMensaje] = useState({name: '', message: ''});
  const [chat, setChat] = useState([]);
  const [conteo, setConteo] = useState(0);

  useEffect(()=>{

    Swal.fire({
      icon: 'question',
      title: 'Identificate',
      input: 'text',
      inputLabel: 'Escribe tu nombre',
      inputValue: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result)=>{
      setMensaje({...mensaje, name: result.value});
    })



    socket.on('chat:client', (data) => {
      console.log(data);
      setChat(data);
    })


    socket.on('cantidadVeces',(data)=>{
      setConteo(data);
    })
  },[]);

  const enviarMensaje = (e) => {
    e.preventDefault();
    socket.emit('mensaje:server', mensaje)
    setMensaje({...mensaje, message: ''});
  }


  return (
    <div className="container mt-5">
      <Asambleas />
      {/* <div className='bg-dark text-white p-5 rounded'>
        <h1>Chat</h1>
        {
          chat.map((msg, index) => (
            <div key={index} className="alert alert-primary" role="alert">
              {msg.name}: {msg.message}
            </div>
          ))
        }
      </div>
      <form className='mt-5' onSubmit={enviarMensaje}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Mensaje</label>
          <input type="text" className="form-control" id="message" placeholder='Escribe tu mensaje aqui' value={mensaje.message} onChange={(e)=>setMensaje({...mensaje, message: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form> */}

    </div>
  )
}

export default App
