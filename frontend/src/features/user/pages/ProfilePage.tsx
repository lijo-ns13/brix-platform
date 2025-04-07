import UserProfile from "../componets/Profile/UserProfile";
import AddSection from "../componets/Profile/AddSection";
import ExperienceSection from "../componets/Profile/ExperienceSection";
import ProjectSection from "../componets/Profile/ProjectSection";
import CertificateSection from "../componets/Profile/CertificateSection";
import EducationSection from "../componets/Profile/EducationSection";
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
