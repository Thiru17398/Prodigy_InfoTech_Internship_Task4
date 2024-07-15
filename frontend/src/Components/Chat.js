import React , {useEffect , useState , useRef } from 'react';
import axios from 'axios';

const Chat = () => {

    const [messages,setMessages] = useState([]);
    const [input,setInput] = useState('');  
    const ws = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:8080/messsages").then(res => res.json())
        .then(data => setMessages(data));

        ws.current = new WebSocket('ws://localhost:8080');
        ws.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };
    })

    function sendMessage(){
        const message = {
            user:'User',
            message:input
        };
        ws.current.send(JSON.stringify(message));
        setInput('');
    }

  return (
    <div>
        <div>
            {
                messages.length > 0 && messages.map( (msg , index) => {
                    <div key={index}>
                        <p>{msg.user}</p><p>{msg.message}</p>
                    </div>
                })
            }
        </div>
        <input value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
            if(e.key == 'enter')
                sendMessage();      
        }}

        />
        <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default Chat;