import pdfParse from "pdf-parse/lib/pdf-parse.js";
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

/**
 * @description Controller to generate interview report
 */
async function generateInterViewReportController(req, res) {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeContent = pdfData.text;

    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

/**
 * @description Get interview report by ID
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Get all interview reports of logged-in user
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Generate resume PDF
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport = await interviewReportModel.findById(
    interviewReportId
  );

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

export {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};

