import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import FeatureShowcase from "../components/landing/FeatureShowcase";
import LandingHero from "../components/landing/LandingHero";
import TrustStrip from "../components/landing/TrustStrip";
import SubjectPaths from "../components/landing/SubjectPaths";
import HowItWorks from "../components/landing/HowItWorks";
import TeacherSection from "../components/landing/TeacherSection";
import AudienceSection from "../components/landing/AudienceSection";
import LandingFAQ from "../components/landing/LandingFAQ";
import ClosingSection from "../components/landing/ClosingSection";
export default function Landing() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dashboard =
    user?.role === "tutor"
      ? "/tutor/dashboard"
      : user?.role === "admin"
        ? "/admin"
        : "/parent/dashboard";
  useEffect(() => {
    let live = true;
    Promise.allSettled([
      API.get("/categories"),
      API.get("/tutors", { params: { sort: "rating", limit: 3 } }),
    ])
      .then(([c, t]) => {
        if (!live) return;
        if (c.status === "fulfilled") setCategories(c.value.data || []);
        if (t.status === "fulfilled") setTutors(t.value.data || []);
        else setError(true);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);
  return (
    <div className="landing-page">
      <LandingHero
        categories={categories}
        tutors={tutors}
        loading={loading}
        error={error}
        dashboard={dashboard}
      />
      <TrustStrip />
      <SubjectPaths categories={categories} loading={loading} />
      <FeatureShowcase />
      <HowItWorks />
      <TeacherSection tutors={tutors} />
      <AudienceSection />
      <LandingFAQ />
      <ClosingSection />
    </div>
  );
}
