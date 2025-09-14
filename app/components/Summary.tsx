import { motion } from "framer-motion";
import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <motion.div
      className="resume-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="category flex flex-row items-center p-6 gap-8 border-b-[0.7px] border-gray-200 rounded-sm shadow-sm hover:shadow-md transition">
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <p className="text-xl font-semibold">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-lg">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </motion.div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <motion.div
      className="bg-white rounded-lg border-[0.7px] border-gray-200 shadow-sm w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex flex-row items-center p-6 gap-8 border-b-[0.7px] border-gray-200">
        <ScoreGauge score={feedback.overallScore} />
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>
{/* Categories */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
  <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
  <Category title="Content" score={feedback.content.score} />
  <Category title="Structure" score={feedback.structure.score} />
  <Category title="Skills" score={feedback.skills.score} />
</div>

    </motion.div>
  );
};


export default Summary;
