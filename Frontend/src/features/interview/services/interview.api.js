import axios from "axios";

// Axios instance
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

/**
 * @description Generate interview report
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    try {
        const formData = new FormData();

        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);

        // ✅ only append if file exists
        if (resumeFile) {
            formData.append("resume", resumeFile);
        }

        const response = await api.post("/api/interview/", formData);

        return response.data;

    } catch (error) {
        console.error("❌ Generate Interview Report Error:", error?.response?.data || error.message);
        return null;
    }
};


/**
 * @description Get interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`);
        return response.data;

    } catch (error) {
        console.error("❌ Get Report By ID Error:", error?.response?.data || error.message);
        return null;
    }
};


/**
 * @description Get all reports
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview/");
        return response.data;

    } catch (error) {
        console.error("❌ Get All Reports Error:", error?.response?.data || error.message);
        return [];
    }
};


/**
 * @description Generate Resume PDF
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.post(
            `/api/interview/resume/pdf/${interviewReportId}`,
            null,
            { responseType: "blob" }
        );

        return response.data;

    } catch (error) {
        console.error("❌ Generate Resume PDF Error:", error?.response?.data || error.message);
        return null;
    }
};

console.log("✅ API Module Loaded");