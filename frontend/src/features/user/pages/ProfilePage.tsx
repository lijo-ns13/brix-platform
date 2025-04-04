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
      <ExperienceSection />
      <ProjectSection />
      <CertificateSection />
      <EducationSection />
    </>
  );
}
export default ProfilePage;
