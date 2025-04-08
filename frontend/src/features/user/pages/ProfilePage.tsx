import React from "react";
const UserProfile = React.lazy(
  () => import("../componets/Profile/UserProfile")
);
const AddSection = React.lazy(() => import("../componets/Profile/AddSection"));
const ExperienceSection = React.lazy(
  () => import("../componets/Profile/ExperienceSection")
);
const ProjectSection = React.lazy(
  () => import("../componets/Profile/ProjectSection")
);
const CertificateSection = React.lazy(
  () => import("../componets/Profile/CertificateSection")
);
const EducationSection = React.lazy(
  () => import("../componets/Profile/EducationSection")
);
import Navbar from "../componets/NavBar";
function ProfilePage() {
  return (
    <>
      <Navbar />
      <UserProfile />
      <AddSection />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-12">
          <ExperienceSection />
        </div>
        <div className="mt-12">
          <EducationSection />
        </div>
        <div className="mt-12">
          <CertificateSection />
        </div>
        <div className="mt-12">
          <ProjectSection />
        </div>
      </div>
    </>
  );
}
export default ProfilePage;
