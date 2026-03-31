const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = "";

        // Fix 1: Check if file exists and use correct pdf-parse syntax
        if (req.file) {
            const resumeData = await pdfParse(req.file.buffer);
            resumeText = resumeData.text;
        }

        const { selfDescription, jobDescription } = req.body;

        // Validation: Ensure AI has something to work with
        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Please provide either a resume file or a self-description."
            });
        }

        // Fix 2: Call AI service with extracted text
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // Fix 3: Save to Database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            title: interViewReportByAi.title || "Untitled Position"
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (err) {
        console.error("Error in generateInterViewReportController:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ 
            _id: interviewId, 
            user: req.user.id 
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching report", error: err.message });
    }
}

/** * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching reports", error: err.message });
    }
}

/**
 * @description Controller to generate resume PDF based on user data.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("PDF Generation Error:", err);
        res.status(500).json({ message: "Error generating PDF", error: err.message });
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
};