import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { trollboxSocket } from '../../services/socket/trollbox'
import styles from './styles.module.scss';
import message from "../../services/message";
import trollboxsendbutton from '../../resources/images/trollboxsendbutton.svg';

let _workspaceMessage = []

function Trollbox() {
    const [userMessage, setUserMessage] = React.useState('')
    const [workspaceMessage, setWorkspaceMessages] = React.useState([])
    let scrollBarsRef = React.useRef(null)

    React.useEffect(() => {
        trollboxSocket.onFirstData((messages) => {
            setWorkspaceMessages(messages)
            _workspaceMessage = messages

            scrollToBottom()
        })

        trollboxSocket.onUpdateData(addNewMessage)
    }, [])

    const scrollToBottom = () => {
        if(scrollBarsRef && scrollBarsRef.current){
            scrollBarsRef.current.scrollToBottom()
        }
    }

    const addNewMessage = message => {
        _workspaceMessage = [..._workspaceMessage, message]
        setWorkspaceMessages(_workspaceMessage)
        scrollToBottom()
    }

    const handleKeyPress = event => {
        if (event.which === 13) { //Press enter on the keyboard
            submit()
        }
    }

    const handleTextBoxChange = event => {
        setUserMessage(event.target.value)
    }

    const submit = () => {
        trollboxSocket.sendMessage(userMessage)
        setUserMessage('')
    }

    return (
        <div className={styles.container} id="troll-box">
            <div className={styles.messageWrapper}>
                <div id="data" className={styles.messageContainer}>
                <Scrollbars
                    style={{
                        height: 383,
                    }}
                    ref={scrollBarsRef}
                >
                    {
                        workspaceMessage.map(message => {
                            if (message) {
                                return (
                                    <div className={styles.messageContainerSingle} key={message.create_at}>
                                        <div className={styles.senderName}> {message.email.split('@')[0]}:</div>
                                        <div
                                            className={styles.message}>{message.message}
                                        </div>
                                    </div>
                                )
                            } else {
                                return null
                            }
                        })
                    }
                    </Scrollbars>
                </div>
            </div>

            <div className={styles.inputContainer}>
                <input
                    onKeyPress={handleKeyPress}
                    value={userMessage}
                    onChange={handleTextBoxChange}
                    placeholder={'Say something...'}
                    className={styles.inputField}
                    spellCheck={false}
                />

                <button onClick={submit} className={styles.submitMessage}>
                    <img src={trollboxsendbutton}/>
                </button>
            </div>
        </div>
    )
}

export default Trollbox;