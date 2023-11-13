import { useEffect, useRef, useState } from 'react'
import './PeerVideo.css'
import Peer from 'peerjs'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
export default function Peervideo() {


    const [initalView, setinitialView] = useState('initial')
    const meetId = useRef(null)
    const incommingVideo = useRef(null)
    const outgoingVideo = useRef(null)
    const [peerId,setPeerId] = useState(null)
    const currentPeer = useRef(null)
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');

    const params = new URL(window.location.href).searchParams;
    
    const socket = io('https://dtt-meets-backend.adaptable.app/',{
        transports:['websocket', 'polling']
    })

    useEffect(() => {


        let peer = new Peer();
        console.log("id params",params.get('id'))
        let meetId=params.get('id');

        

        
        peer.on('open', (id)=>{
            console.log(id)
            setPeerId(id)
            if(params.get('id')!=undefined){
                
                socket.emit('join',{roomid:meetId,peerid:id})
            }
            socket.on('userJoined',(peeId)=>{
                
                
                console.log("Heelo ",peeId," jj ",id)
                if(peeId.data!=undefined && peeId.data!=id &&peeId.result<3){
                    setinitialView('startCall')
                    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    console.log("hello userJoined")
                    getUserMedia({ video: true, audio: true},(mediaStream)=>{
                        outgoingVideo.current.srcObject = mediaStream;
                        setinitialView('startCall')
                        const call = currentPeer.current.call(peeId.data,mediaStream)
    
                        call.on('stream',(remoteStream)=>{
                            incommingVideo.current.srcObject = remoteStream;
                        })
    
                    })
                }
            })
        })

        
        

        
        

        peer.on('call',(call)=>{

            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            setinitialView('startCall')
            getUserMedia({ video: true, audio: true }, (mediaStream) => {
                outgoingVideo.current.srcObject = mediaStream;
                call.answer(mediaStream)
                console.log("call meta data",call.metadata," /n ",call)
                setRemotePeerIdValue(call.peer)
                call.on('stream',(remoteStream)=>{
                    incommingVideo.current.srcObject = remoteStream
                })
            });

        })

        currentPeer.current = peer;
        

    }, [])

    const onInputSubmitOrButtonClick = () => {
        console.log(remotePeerIdValue, "  jjjs")
        setinitialView('startCall')

        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        console.log("hello")
        getUserMedia({ video: true, audio: true},(mediaStream)=>{
            outgoingVideo.current.srcObject = mediaStream;
            
            const call = currentPeer.current.call(remotePeerIdValue,mediaStream)

            call.on('stream',(remoteStream)=>{
                incommingVideo.current.srcObject = remoteStream;
            })

        })
        
        

    }


    return (

        <>
            {initalView == 'initial' ? <div className=''>
                <div className='MeetHeading'>
                    <h1>Welcome to DTT Meets</h1><br></br>
                    <h2>Your ID is  {peerId}</h2>
                </div>

                <div className='contianerMain'><p>Have a Meeting ID Use it to enter a meet</p>
                    <form onSubmit={() => onInputSubmitOrButtonClick()}>
                        <label style={{ marginRight: '8px' }}>Please Enter the meeting id</label>
                        <input onChange={e => setRemotePeerIdValue(e.target.value)} style={{ marginRight: '8px' }}></input>
                        <button onClick={() => { onInputSubmitOrButtonClick() }}>Submit</button>  </form></div>
            </div> :
                initalView == 'startCall' ? <div >
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "80px", marginBottom: "24px" }}> Welcome to Call Meet Id<b style={{marginLeft: "4px"}}>{remotePeerIdValue}</b></div>
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                        <div className='incomingVideo'>
                            <video className='videoContainer' autoPlay ref={incommingVideo}></video>
                        </div>


                    </div>
                    <div >
                        <div className='outgoingVideo'>
                            <video  muted className="videoContainer" autoPlay ref={outgoingVideo}></video>
                        </div>
                    </div>

                </div>

                    : " hekko"

            }


        </>
    )
}
