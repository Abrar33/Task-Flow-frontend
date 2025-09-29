// frontend/src/pages/InviteAccept.js

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";

const InviteAccept = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, rehydrated } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid invite link");
      return;
    }

    // Wait until auth state is ready
    if (!rehydrated) return;

    // If user not logged in, store token and redirect to login
    if (!user) {
      localStorage.setItem("inviteToken", token);
      navigate("/login");
      return;
    }

    // User is logged in, attempt to join the board
    const acceptInvite = async () => {
      try {
        const { data } = await axios.post(
          `http://localhost:3000/api/boards/join?token=${token}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        toast.success("Invite accepted! 🎉");
        navigate(`/boards/${data.board._id}`);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error accepting invite");
      }
    };

    acceptInvite();
  }, [searchParams, navigate, user, rehydrated]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Processing your invite...</p>
    </div>
  );
};

export default InviteAccept;