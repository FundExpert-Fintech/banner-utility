import axios from "axios";

export const submitFormData = async (formData) => {
  try {
    const response = await axios.post('API URL', formData);
    return response.data;
  } catch (error) {
    throw new Error(`Error submitting data: ${error.message}`);
  }
};
