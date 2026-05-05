import axios from "axios"

const BASE_URL = "https://api.almostcrackd.ai"

export const createFlavor = async (name: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/flavors/create`, { name })
    return res.data
  } catch (err: any) {
    console.log("STATUS:", err.response?.status)
    console.log("DATA:", err.response?.data)
    throw err
  }
}

export const createStep = async (flavorId: string, prompt: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/steps/create`, {
      flavor_id: flavorId,
      prompt
    })
    return res.data
  } catch (err: any) {
    console.log("STATUS:", err.response?.status)
    console.log("DATA:", err.response?.data)
    throw err
  }
}
export const getFlavors = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/flavors/read`)
    return res.data
  } catch (err: any) {
    console.log("STATUS:", err.response?.status)
    console.log("DATA:", err.response?.data)
    throw err
  }
}

export const getSteps = async (flavorId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/steps/read`, {
      params: { flavor_id: flavorId }
    })
    return res.data
  } catch (err: any) {
    console.log("STATUS:", err.response?.status)
    console.log("DATA:", err.response?.data)
    throw err
  }
}