import React, { useEffect, useState } from "react";
import { FolderGit2, Layout, Key, Users, Bell } from "lucide-react";
import { NotificationsModal } from "./modals/NotificationsModal";
import { ConnectionsModal } from "./modals/ConnectionsModal";
import { JoinCodespaceModal } from "./modals/JoinCodespaceModal";
import { useChange } from "./customhook/spaceinfo";
import { CodeSpaceInfo, setCodeSpace } from "../../globaltool";
import axios from "axios";
import type { Project, User } from "../types";

// Define type for a codespace
interface CodeSpace {
  id: string;
  name: string;
  folder: string[];
  _id: string; // Assuming the space object has an _id field
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces",
    status: "online",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces",
    status: "offline",
  },
];

// Fetch codespaces from the server
async function fetchCodeSpaces(
  setSpaces: React.Dispatch<React.SetStateAction<CodeSpace[]>>,
  setChange: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrCodeSpaceName: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const response = await axios.post(
      "http://localhost:5001/space/getCodeSpace",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Ensure the response data is an array
    const spaces = Array.isArray(response.data) ? response.data : [];
    CodeSpaceInfo.spaces = spaces;
    CodeSpaceInfo.currCodeSpaceId = spaces[0]?._id || "";
    console.log(spaces);

    // Update state with fetched data
    setSpaces(spaces);
    setCurrCodeSpaceName(spaces[0]?.name || ""); // Set the current codespace name
  } catch (error) {
    console.error("Error fetching code spaces:", error);
  } finally {
    // Ensure `setChange` is reset to false
    setChange(false);
  }
}

interface SidebarProps {
  projects: Project[];
  activeProject?: string;
  onProjectSelect: (id: string) => void;
}

export function Sidebar({ projects, activeProject, onProjectSelect }: SidebarProps) {
  const [spaces, setSpaces] = useState<CodeSpace[]>([] as CodeSpace[]);
  const [currCodeSpaceName, setCurrCodeSpaceName] = useState<string>("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showJoinCodespace, setShowJoinCodespace] = useState(false);

  const { change, setChange, setCurrCodeSpaceId, currCodeSpaceId, currspacefolder } = useChange();

  useEffect(() => {
    if (change) {
      fetchCodeSpaces(setSpaces, setChange, setCurrCodeSpaceName);
    }
  }, [change, setChange]);

  // Handle selecting a codespace
  const handleCodeSpaceSelect = (spaceId: string) => {
    const selectedSpace = spaces.find((space) => space._id === spaceId);
    if (selectedSpace) {
      setCurrCodeSpaceId(spaceId);
      CodeSpaceInfo.currCodeSpaceId = spaceId; // Set the current codespace ID
      console.log(`New Codespace ID: ${spaceId}`); // Print the new codespace ID
      setCodeSpace(setChange, setCurrCodeSpaceName);
    }
  };

  return (
    <div className="w-[72px] bg-[#1e1f22] h-screen flex flex-col items-center py-4 gap-2">
      <button className="w-12 h-12 rounded-full bg-[#313338] flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
        <Layout className="w-6 h-6" />
      </button>

      <div className="w-8 h-px bg-[#2b2d31] my-2" />

      {/* Render projects */}
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectSelect(project.id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            activeProject === project.id
              ? "bg-blue-600 text-white"
              : "bg-[#313338] text-gray-300 hover:bg-blue-600 hover:text-white hover:rounded-2xl"
          }`}
        >
          <FolderGit2 className="w-6 h-6" />
        </button>
      ))}

      {/* Render codespaces */}
      {spaces.length > 0 ? (
        spaces.map((space) => (
          <button
            key={space._id}
            title={space.name}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-[#313338] text-gray-300 hover:bg-blue-600 hover:text-white hover:rounded-2xl"
            onClick={() => handleCodeSpaceSelect(space._id)}
          >
            <FolderGit2 className="w-6 h-6" />
          </button>
        ))
      ) : (
        <p className="text-gray-400 text-sm mt-4">No codespaces available</p>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => setShowJoinCodespace(true)}
          className="w-12 h-12 rounded-full bg-[#313338] flex items-center justify-center text-gray-300 hover:bg-[#404249] hover:text-white transition-colors"
        >
          <Key className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowConnections(true)}
          className="w-12 h-12 rounded-full bg-[#313338] flex items-center justify-center text-gray-300 hover:bg-[#404249] hover:text-white transition-colors"
        >
          <Users className="w-6 h-6" />
        </button>
        <button
          onClick={() => setShowNotifications(true)}
          className="w-12 h-12 rounded-full bg-[#313338] flex items-center justify-center text-gray-300 hover:bg-[#404249] hover:text-white transition-colors"
        >
          <Bell className="w-6 h-6" />
        </button>
      </div>

      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      <ConnectionsModal
        isOpen={showConnections}
        onClose={() => setShowConnections(false)}
        connections={mockUsers}
      />

      <JoinCodespaceModal isOpen={showJoinCodespace} onClose={() => setShowJoinCodespace(false)} />
    </div>
  );
}
