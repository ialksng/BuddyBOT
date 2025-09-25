import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/tokyo-night-light.css";

// react-markdown - formatting
// rehype-highlight - syntax highlighting

function Chat() {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); // prevChat load
            return;
        }

        // latestReply separate => typing effect create
        if(!prevChats?.length) return;

        const content = reply.split(" "); // individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return() => clearInterval(interval);

    }, [prevChats, reply])

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "buddyDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )    
                }

                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="buddyDiv" key={"non-typing"} >
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="buddyDiv" key={"typing"} >
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )    
                            }
                        </>
                    )
                }

                {/* {
                     prevChats.length > 0  && latestReply !== null &&
                         <div className="buddyDiv" key={"typing"} >
                                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                         </div>
                }

                {
                     prevChats.length > 0  && latestReply === null &&
                         <div className="buddyDiv" key={"non-typing"} >
                                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                         </div>
                } */}
            </div>
        </>
    )
}

export default Chat;