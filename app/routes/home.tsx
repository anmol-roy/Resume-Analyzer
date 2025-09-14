import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="page-heading text-center py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-lg animate-fade-in">
            Track Your Applications & Resume Ratings
          </h1>

          {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="mt-4 text-xl text-gray-600 animate-fade-in">
              No resumes found. Upload your first resume to get feedback.
            </h2>
          ) : (
            <h2 className="mt-4 text-xl text-gray-700 animate-fade-in">
              Review your submissions and check AI-powered feedback.
            </h2>
          )}
        </div>

        {/* Loader */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/resume-scan-2.gif"
              className="w-[200px] animate-pulse border border-gray-300 rounded-none"
            />
            <p className="mt-4 text-gray-600 font-medium">
              Scanning resumes...
            </p>
          </div>
        )}

        {/* Resume Cards */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="transform transition-all hover:scale-105 hover:shadow-2xl border border-gray-300 rounded-none"
              >
                <ResumeCard resume={resume} />
              </div>
            ))}
          </div>
        )}

        {/* Upload Resume Button */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="w-fit px-6 py-3 border border-indigo-600 rounded-none shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
