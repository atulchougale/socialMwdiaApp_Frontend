import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import userConversation from "../../../Zustand/userConversation";
import { useSocketContext } from "../../../context/SocketContext";



const Sidebar = ({onSelectUser}) => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchuser] = useState([]);
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSetSelectedUserId] = useState(null);
  const { message , setMessages, selectedConversation, setSelectedConversation } = userConversation();
  const [newMessageUsers, setNewMessageUsers] = useState('');


  const { onlineUser, socket } = useSocketContext(); // Call the hook properly
  
  const talkedwith = chatUser.map((user) => (user._id));
  const isOnline = talkedwith.map(userId => onlineUser.includes(userId));
  // console.log(isOnline);

  //socketIo
useEffect(()=>{
  socket?.on("newMessage",(newMessage)=>{
    setNewMessageUsers(newMessage);
  })

  return ()=> socket?.off("newMessage")
},[socket,message])




  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await api.get(`/users/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
        //   console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);
//   console.log(chatUser);

  const handelSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await api.get(`users/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        // console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
//   console.log(searchUser);

  const handelUserClick = (user) => {
    onSelectUser(user)
    setSetSelectedUserId(user._id);
    setSelectedConversation(user);
    setNewMessageUsers('');
  };

  const handSearchback = () => {
    setSearchuser([]);
    setSearchInput('')
}

  const image = authUser.profilepic;
  //   console.log(image);
  const imageUrl1 = image ? image.replace(/\\/g, "/") : "";
  const imageUrl = imageUrl1 ? imageUrl1.split("/uploads")[1] : "";

  const url = imageUrl
    ? `http://localhost:5000/uploads${imageUrl}`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

 
  return (
    <div className="h-full w-auto px-1 ">
      <div className="flex justify-between gap-1 mt-2">
        <form
          onSubmit={handelSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full "
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="px-4 w-full bg-transparent outline-none rounded-full"
            placeholder="search user"
          />
          <button className="w-16 h-10 m-1 flex items-center justify-center rounded-full bg-sky-700 hover:bg-gray-950 text-white">
            <FaSearch />
          </button>
        </form>

        <img
          alt="profile"
          onClick={() => navigate(`/profile`)}
          src={url}
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer"
          style={{ borderRadius: "50%" }}
        />
      </div>

      <div className="divider px-3"></div>

      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
            <div className="w-auto">
              {searchUser.map((user, index) => {
                
                const photo = user?.profilePicture;
                const photo1 = photo ? photo.replace(/\\/g, "/") : "";
                const photoUrl = photo1 ? photo1.split("/uploads")[1] : "";
                const pUrl = photoUrl
                  ? `http://localhost:5000/uploads${photoUrl}`
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

                return (
                  <div key={user._id}>
                    <div
                      onClick={() => handelUserClick(user)}
                      className={`flex gap-3 
                            items-center rounded 
                            p-2 py-1 cursor-pointer
                            ${
                              selectedUserId === user?._id ? "bg-sky-500" : ""
                            } `}
                    >
                      {/* Socket is Online */}
                      <div
                        className={`avatar ${isOnline[index] ? "online" : ""}`}
                      >
                        <div className="w-12 rounded-full">
                          <img src={pUrl} alt="user.img" />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-bold " style={{ color: "#fff" }}>
                          {user.username}
                        </p>
                      </div>
                    </div>
                    <div className="divider divide-solid px-3 h-[1px]"></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handSearchback}
              className="bg-white rounded-full px-2 py-1 self-center"
            >
              <IoArrowBackSharp size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>Why are you Alone!!🤔</h1>
                    <h1>Search username to chat</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => {
                    // Similar logic to generate pUrl for chatUser
                    const photo = user?.profilePicture;
                    const photo1 = photo ? photo.replace(/\\/g, "/") : "";
                    const photoUrl = photo1 ? photo1.split("/uploads")[1] : "";
                    const pUrl = photoUrl
                      ? `http://localhost:5000/uploads${photoUrl}`
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

                    return (
                      <div key={user._id}>
                        <div
                          onClick={() => handelUserClick(user)}
                          className={`flex gap-3 
                                items-center rounded 
                                p-2 py-1 cursor-pointer
                                ${
                                  selectedUserId === user?._id
                                    ? "bg-sky-500"
                                    : ""
                                } `}
                        >
                          {/* Socket is Online */}
                          <div
                            className={`avatar ${
                              isOnline[index] ? "online" : ""
                            }`}
                          >
                            <div className="w-12 rounded-full">
                              <img src={pUrl} alt="user.img" />
                            </div>
                          </div>
                          <div className="flex flex-col flex-1">
                            <p className="font-bold " style={{ color: "#fff" }}>
                              {user.username}
                            </p>
                          </div>
                          <div>
                              { 
                              newMessageUsers.reciverId === authUser._id  
                              && newMessageUsers.senderId === user._id ? 
                              <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">+1
                              </div>
                              :
                              <></>}
                          </div>
                        </div>
                        <div className="divider divide-solid px-3 h-[1px]"></div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          
        </>
      )}
    </div>
  );
};

export default Sidebar;
