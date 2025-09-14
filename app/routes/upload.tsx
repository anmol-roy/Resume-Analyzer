import { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section max-w-4xl mx-auto px-6">
        <div className="page-heading text-center py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-lg">
            Smart feedback for your dream job
          </h1>

          {isProcessing ? (
            <>
              <h2 className="mt-4 text-lg font-medium text-gray-700">{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                className="w-[300px] mx-auto mt-6 border border-gray-300 rounded-sm shadow-md"
              />
            </>
          ) : (
            <h2 className="mt-4 text-lg text-gray-600">
              Drop your resume for an ATS score and improvement tips
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 mt-10 p-6 bg-white/80 backdrop-blur-md shadow-lg border border-gray-300 rounded-sm"
            >
              {/* Company Name */}
              <div className="form-div flex flex-col gap-2">
                <label
                  htmlFor="company-name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                  className="px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Job Title */}
              <div className="form-div flex flex-col gap-2">
                <label
                  htmlFor="job-title"
                  className="text-sm font-semibold text-gray-700"
                >
                  Job Title
                </label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                  className="px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Job Description */}
              <div className="form-div flex flex-col gap-2">
                <label
                  htmlFor="job-description"
                  className="text-sm font-semibold text-gray-700"
                >
                  Job Description
                </label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                  className="px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Resume Uploader */}
              <div className="form-div flex flex-col gap-2">
                <label
                  htmlFor="uploader"
                  className="text-sm font-semibold text-gray-700"
                >
                  Upload Resume
                </label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              {/* Button */}
              <button
                className="primary-button px-6 py-3 border border-indigo-600 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                type="submit"
              >
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
