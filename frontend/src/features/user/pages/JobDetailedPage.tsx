import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJob } from "../services/JobServices";
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  CheckIcon,
  BuildingOfficeIcon,
  ShareIcon,
  BookmarkIcon,
  UserGroupIcon,
  StarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ApplyModal from "../componets/ApplyModal";

function JobDetailedPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);

  async function fetchJobDetails(id: string) {
    try {
      const res = await getJob(id);
      // Access the first element of the array if response is an array
      const jobData = Array.isArray(res) ? res[0] : res;
      setJob(jobData);
    } catch (err) {
      setError("Failed to load job details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleApply = () => {
    setShowApplyModal(true);
    setApplicationSuccess(false);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    console.log("Share job:", job?._id);
  };

  const formatSalary = () => {
    if (job?.salary?.isVisibleToApplicants) {
      return `${job.salary.currency || "INR"} ${job.salary.min}L - ${
        job.salary.max
      }L /year`;
    }
    return "Competitive Salary";
  };

  const getApplyBtnClass = () => {
    return job?.status === "open"
      ? "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      : "w-full bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed";
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center max-w-2xl mx-auto my-8">
        <div className="text-xl font-semibold mb-2">Error Loading Job</div>
        <p>{error}</p>
        <button
          onClick={() => fetchJobDetails(jobId || "")}
          className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16 max-w-2xl mx-auto">
        <div className="text-gray-400 text-6xl mb-4">404</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Job Not Found</h2>
        <p className="text-gray-500">
          The job posting you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Success notification */}
      {applicationSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" />
            <span>Application submitted successfully!</span>
          </div>
        </div>
      )}

      {/* Header with actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <span
                className={`px-2 py-0.5 rounded ${
                  job.status === "open"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {job.status === "open" ? "Actively Hiring" : "Closed"}
              </span>
              <span className="text-gray-500">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium text-gray-800">
                {job.company?.companyName || "Company Name"}
              </span>
              {job.company?.isVerified && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckIcon className="h-3 w-3 mr-1" /> Verified
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 md:justify-end">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full ${
                bookmarked
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              } hover:bg-gray-200 transition-colors`}
              aria-label="Bookmark job"
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Share job"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <BriefcaseIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Type</span>
            </div>
            <div className="font-medium capitalize">
              {job.employmentType || "Not Specified"}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Location</span>
            </div>
            <div className="font-medium">{job.location || "Not Specified"}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Salary</span>
            </div>
            <div className="font-medium">{formatSalary()}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <AcademicCapIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Experience</span>
            </div>
            <div className="font-medium capitalize">
              {job.experienceLevel || "Not Specified"}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <GlobeAltIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Work Mode</span>
            </div>
            <div className="font-medium capitalize">
              {job.jobType || "Not Specified"}
            </div>
          </div>
        </div>

        {/* Deadline Banner */}
        {job.applicationDeadline && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-amber-500 mr-2" />
              <div>
                <span className="text-amber-800 font-medium">
                  Application Deadline:{" "}
                </span>
                <span className="text-amber-700">
                  {new Date(job.applicationDeadline).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
            <div className="text-sm text-amber-600 hidden md:block">
              {new Date(job.applicationDeadline) > new Date()
                ? `${Math.ceil(
                    (new Date(job.applicationDeadline).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} days left`
                : "Deadline passed"}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Job Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 p-1.5 rounded-lg mr-2">
                <BriefcaseIcon className="h-5 w-5 text-blue-600" />
              </span>
              Job Description
            </h2>
            <div className="space-y-4 text-gray-700 prose prose-blue max-w-none whitespace-pre-line">
              {job.description || "No description provided."}
            </div>
          </div>

          {/* Skills Required */}
          {job.skillsRequired?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-100 p-1.5 rounded-lg mr-2">
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                </span>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm font-medium flex items-center"
                  >
                    {skill.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {(job.benefits?.length > 0 || job.perks?.length > 0) && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-green-100 p-1.5 rounded-lg mr-2">
                  <StarIcon className="h-5 w-5 text-green-600" />
                </span>
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.benefits?.map((benefit: string, index: number) => (
                  <div
                    key={`benefit-${index}`}
                    className="flex items-center bg-green-50 p-3 rounded-lg"
                  >
                    <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-800">{benefit}</span>
                  </div>
                ))}
                {job.perks?.map((perk: string, index: number) => (
                  <div
                    key={`perk-${index}`}
                    className="flex items-center bg-green-50 p-3 rounded-lg"
                  >
                    <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-800">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Apply section */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <button
              onClick={handleApply}
              disabled={job.status !== "open"}
              className={getApplyBtnClass()}
            >
              {job.status === "open" ? "Apply Now" : "Applications Closed"}
            </button>

            {job.status === "open" && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Easy application process, takes only a few minutes
              </p>
            )}

            <div className="my-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-600" />
                About the Company
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl mr-3">
                    {job.company?.companyName?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {job.company?.companyName || "Company Name"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.company?.industryType || "Industry"}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm border-l-4 border-gray-200 pl-3">
                  {job.company?.about || "No company description available."}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Est. {job.company?.foundedYear || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{job.company?.location || "Location N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>50-200 employees</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Company website</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Job ID: {job._id}
              </h3>
              <div className="text-xs text-gray-500">
                <p>Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                <p>
                  Last updated on {new Date(job.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Jobs */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Similar Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Just placeholder cards for similar jobs */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium">Similar {job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Another Company</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  Remote
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  Full-time
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && job && (
        <ApplyModal
          jobId={job._id}
          onClose={() => setShowApplyModal(false)}
          onApplySuccess={() => {
            setApplicationSuccess(true);
            setShowApplyModal(false);
          }}
        />
      )}
    </div>
  );
}

export default JobDetailedPage;
