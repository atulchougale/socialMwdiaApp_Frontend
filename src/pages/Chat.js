import React, { useEffect, useState } from "react";
import { Card, Button, Form, ListGroup, Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";
import { toast } from "react-toastify";
import '../styles/Chat.css'; // Import custom CSS for styling
import img1 from "../assets/images/img1.png"

const Chat = ({ currentUserId }) => {
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const selectedChat = "";

  // Fetch the chat list when the component mounts
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await api.get(`/chat/list/${currentUserId}`);
        setChatList(response.data);
      } catch (error) {
        toast.error("Failed to load chat list");
      }
    };
    fetchChatList();
  }, [currentUserId]);

  // Fetch the messages and the selected user's details when activeChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeChat) {
        try {
          const response = await api.get(`/chat/${activeChat}`);
          setMessages(response.data);
          
          // Fetch selected user details for display
          const selectedUserResponse = await api.get(`/user/${activeChat}`);
          setSelectedUser(selectedUserResponse.data);
        } catch (error) {
          toast.error("Failed to load messages");
        }
      }
    };
    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    try {
      const response = await api.post("/chat/send", {
        senderId: currentUserId,
        recipientId: activeChat,
        messageText: newMessage,
      });
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="chat-container">
  {/* Left Section: Chat List */}
  <div className="chat-list">
    {chatList.map((chat) => (
      <div
        key={chat.id}
        className={`chat-item ${selectedChat === chat.id ? "active" : ""}`}
        // onClick={() => handleSelectChat(chat.id)}
      >
        <img
          src={chat.profilePicture}
          alt="Profile"
          className="chat-profile-pic"
        />
        <div className="chat-info">
          <div className="chat-username">{chat.username}</div>
          <div className="chat-last-message">{chat.lastMessage}</div>
        </div>
      </div>
    ))}
  </div>

  {/* Right Section: Chat Window */}
  <div className="chat-window">
    {selectedChat ? (
      <>
        {/* Display selected user's profile photo and username */}
        <div className="chat-header">
          <img
            src={selectedUser.profilePicture}
            alt="Profile"
            className="chat-header-pic"
          />
          <span className="chat-header-username">{selectedUser.username}</span>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
            //   className={`message-item ${
            //     message.senderId === currentUser.id ? "sent" : "received"
            //   }`}
            >
              <div className="message-content">{message.text}</div>
              <div className="message-timestamp">{message.timestamp}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </>
    ) : (
      <div className="no-chat-selected">
        {/* Display Profile Picture and Username */}
        <img
          src={img1}
          alt="Profile"
          className="no-chat-profile-pic"
        />
        <h2>atul</h2>
      </div>
    )}
  </div>
</div>

  );
};

export default Chat;
