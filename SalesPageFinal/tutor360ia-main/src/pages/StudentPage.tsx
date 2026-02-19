import { useEffect } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StudentHeroSection from "@/components/student/StudentHeroSection";
import StudentPainSection from "@/components/student/StudentPainSection";
import StudentInsightSection from "@/components/student/StudentInsightSection";
import StudentSolutionSection from "@/components/student/StudentSolutionSection";
import StudentHowItWorksSection from "@/components/student/StudentHowItWorksSection";
import StudentBenefitsSection from "@/components/student/StudentBenefitsSection";
import StudentTargetSection from "@/components/student/StudentTargetSection";
import StudentPlansSection from "@/components/student/StudentPlansSection";
import StudentReinforcementSection from "@/components/student/StudentReinforcementSection";
import StudentFinalCTASection from "@/components/student/StudentFinalCTASection";

const StudentPage = () => {
    useEffect(() => {
        // Handle initial scroll to anchor if present in URL
        // In HashRouter, window.location.hash might be like #/estudante#planos
        const fullHash = window.location.hash;
        if (fullHash) {
            const hashParts = fullHash.split('#');
            if (hashParts.length > 2) {
                const targetId = hashParts[hashParts.length - 1];
                if (targetId) {
                    setTimeout(() => {
                        const element = document.getElementById(targetId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 800);
                }
            } else if (hashParts.length === 2 && !hashParts[1].startsWith('/')) {
                // Standard anchor like #planos
                const targetId = hashParts[1];
                setTimeout(() => {
                    const element = document.getElementById(targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 800);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Reusing existing Header but assuming it links to home or has relevant nav items */}
            <Header />

            <main>
                <StudentHeroSection />
                <StudentPainSection />
                <StudentInsightSection />
                <StudentSolutionSection />
                <StudentHowItWorksSection />
                <StudentBenefitsSection />
                <StudentTargetSection />
                <StudentPlansSection />
                <StudentReinforcementSection />
                <StudentFinalCTASection />
            </main>

            <Footer />
            {/* Reusing floating WhatsApp button */}
            <WhatsAppButton />
        </div>
    );
};

export default StudentPage;
