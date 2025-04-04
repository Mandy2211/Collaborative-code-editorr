import axios from "axios";

export const CodeSpaceInfo: {
  name: string;
  currCodeSpaceName: string;
  currCodeSpaceId: string;
  currspacefolder: string[];
  spaces: { id: string; name: string; owners: string[] }[];
} = {
  name: "",
  currCodeSpaceName: "",
  currCodeSpaceId: "",
  currspacefolder: [],
  spaces: [],
};

export const currCodeSpaceName = CodeSpaceInfo.currCodeSpaceName; // Export currCodeSpaceName

export const setCodeSpace = async (
  setChange: (value: boolean) => void,
  setCurrCodeSpaceName: (name: string) => void
): Promise<any> => {
  try {
    const token = localStorage.getItem("token"); // Get auth token from local storage
    if (!token) {
      throw new Error("Authentication token is missing.");
    }

    // Make an API call to fetch additional space information
    const result = await axios.post(
      "http://localhost:5001/space/getSpaceInfo",
      { spaceid: CodeSpaceInfo.currCodeSpaceId }, // Use currCodeSpaceId for selecting the correct space
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the auth token in headers
        },
      }
    );

    console.log("Space Info Response:", result.data);

    // Update CodeSpaceInfo with the response data
    CodeSpaceInfo.currCodeSpaceName = result.data.Name;
    CodeSpaceInfo.currCodeSpaceId = result.data._id;
    CodeSpaceInfo.currspacefolder = result.data.folder;

    // Update the parent state for current code space name
    setCurrCodeSpaceName(result.data.Name); // This triggers a re-render

    // Set the change flag to false
    setChange(false);

    return result.data; // Return result data to be used as needed
  } catch (err) {
    console.error("Error in setCodeSpace:", err);
    throw err; // Re-throw the error for further handling if needed
  }
};
