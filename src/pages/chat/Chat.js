import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import MessageContainer from "./components/MessageContainer";
import { Container } from "react-bootstrap";

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  useEffect(() => {
    setIsSidebarVisible(!selectedUser);
  }, [selectedUser]);

  return (
    <Container>
      <div
        className=" flex flex-col md:flex-row   h-full p-3 rounded-xl 
       bg-gray-400 bg-clip-padding
        backdrop-filter backdrop-blur-lg 
        bg-opacity-0"
        style={{ width: "80%", height:"86vh", marginLeft: "10%", shadow:"0 0.125rem 0.25rem rgba(1, 1, 2, 0.075)",zIndex:"0" }}
      >
        {/* Sidebar */}
        <div
          className={`md:w-1/3 lg:w-1/4 ${
            isSidebarVisible ? "block" : "hidden md:block"
          }`}
        >
          <Sidebar onSelectUser={handleUserSelect} />
        </div>

        {/* Divider (visible only when a user is selected) */}
        <div
          className={`divider divider-horizontal ${
            selectedUser ? "block" : "hidden md:block"
          }`}
        ></div>

        {/* Message Container with Blur Background */}
        <div
          className={`flex-1 ${selectedUser ? "block" : "hidden md:flex"} 
        bg-gray-200 rounded-lg shadow-lg 
        bg-clip-padding backdrop-filter backdrop-blur-lg mt-3 mb-3 bg-opacity-40 
        max-h-[90vh] overflow-y-auto`}
        >
          <MessageContainer onBackUser={handleShowSidebar} />
        </div>
      </div>
    </Container>
  );
}

export default Chat;
