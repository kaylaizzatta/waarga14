import FamilyInfoSection from "./FamilyInfoSection";
import MemberSection from "./MemberSection";
import SummarySection from "./SummarySection";
import BottomAction from "./BottomAction";

export default function FamilyRegistrationForm() {
  return (
    <div className="space-y-6">

      <FamilyInfoSection />

      <MemberSection />

      <SummarySection />

      <BottomAction />

    </div>
  );
}