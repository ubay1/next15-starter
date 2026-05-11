/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AutoShimmer } from "@ubay182/react-auto-shimmer";
// import { AutoShimmer } from "@/components/shimmer";

// ============================================================================
// Types
// ============================================================================
interface ProfileData {
  name: string;
  email: string;
  location: string;
  avatar: string;
  phone: string;
  tags: string[];
}

// ============================================================================
// Component
// ============================================================================
export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useRouter();
  // const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile dari Random User API
  const fetchProfile = useCallback(async (seed?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = seed
        ? `https://randomuser.me/api/?seed=${seed}&results=1`
        : "https://randomuser.me/api/?results=1";

      const res = await fetch(url);
      const data = await res.json();

      if (data.results?.[0]) {
        const user = data.results[0];
        setProfile({
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          location: `${user.location.city}, ${user.location.country}`,
          avatar: user.picture.large,
          phone: user.phone,
          tags: [
            `Member since ${new Date(user.registered.date).getFullYear()}`,
            user.gender,
            user.nat,
          ],
        });
      }
    } catch (e) {
      setError("Failed to load profile. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch saat mount atau userId berubah
  useEffect(() => {
    fetchProfile(userId);
  }, [userId, fetchProfile]);

  // Handlers
  const goBack = () => navigate.back();
  const refreshProfile = () => fetchProfile(userId);

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div style={styles.profileContainer}>
      {/* Header Navigation */}
      <div style={styles.profileHeader}>
        <button
          onClick={goBack}
          style={{ ...styles.btn, ...styles.btnSecondary }}
        >
          ← Back
        </button>
        <button
          onClick={refreshProfile}
          disabled={loading}
          style={{
            ...styles.btn,
            ...styles.btnPrimary,
            ...(loading ? styles.btnDisabled : {}),
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorBox}>
          <span>⚠️ {error}</span>
          <button
            onClick={refreshProfile}
            style={{ ...styles.btn, ...styles.btnPrimary }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Profile Card dengan AutoShimmer */}
      {!error && (
        <AutoShimmer
          loading={loading}
          cacheKey="profile-card"
          border="1px solid #e5e7eb"
          borderRadius="16px"
          boxShadow="0 8px 24px rgba(0,0,0,0.08)"
          bgColor="#ffffff"
          padding="2rem"
        >
          {profile && (
            <div style={styles.profileContent}>
              {profile?.avatar && (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  style={styles.profileAvatar}
                />
              )}
              <h1 style={styles.profileName}>
                {profile?.name || "Loading..."}
              </h1>
              <p style={styles.profileLocation}>
                📍 {profile?.location || "..."}
              </p>

              <div style={styles.profileDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Email</span>
                  <span style={{ ...styles.value, ...styles.emailValue }}>
                    {profile?.email || "..."}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.label}>Phone</span>
                  <span style={styles.value}>{profile?.phone || "..."}</span>
                </div>
              </div>

              <div style={styles.tags}>
                {profile?.tags?.map((tag, idx) => (
                  <span key={idx} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skeleton Blueprint (untuk first-load shimmer) */}
          {!profile && loading && (
            <div slot="skeleton" style={styles.profileContent}>
              <div style={styles.avatarPlaceholder} />
              <div style={styles.namePlaceholder} />
              <div style={styles.locationPlaceholder} />

              <div style={styles.profileDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.labelPlaceholder} />
                  <span style={styles.valuePlaceholder} />
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.labelPlaceholder} />
                  <span style={styles.valuePlaceholder} />
                </div>
              </div>

              <div style={styles.tags}>
                <span style={styles.tagPlaceholder} />
                <span style={styles.tagPlaceholder} />
                <span style={styles.tagPlaceholder} />
              </div>
            </div>
          )}
        </AutoShimmer>
      )}
    </div>
  );
};

// ============================================================================
// Styles (Inline Objects)
// ============================================================================
const styles: Record<string, React.CSSProperties> = {
  profileContainer: {
    padding: "2rem",
    // maxWidth: "100%",
    width: "100%",
    maxWidth: "600px",
    boxSizing: "border-box",
    margin: "0px auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  btn: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  btnPrimary: {
    background: "#2563eb",
    color: "white",
  },
  btnSecondary: {
    background: "#e5e7eb",
    color: "#374151",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  profileContent: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
  },
  profileAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "1.5rem",
    objectFit: "cover" as const,
    border: "4px solid #f3f4f6",
  },
  profileName: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.75rem",
    margin: "0 0 0.75rem 0",
  },
  profileLocation: {
    color: "#6b7280",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    margin: "0 0 1.5rem 0",
  },
  profileDetails: {
    width: "100%",
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    background: "#f9fafb",
    borderRadius: "8px",
  },
  label: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  value: {
    color: "#111827",
    fontWeight: 500,
    fontSize: "0.95rem",
  },
  emailValue: {
    overflowWrap: "anywhere" as const,
    textAlign: "right" as const,
    maxWidth: "60%",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
    justifyContent: "center",
  },
  tag: {
    background: "#eef2ff",
    color: "#3730a3",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
  },
  // Skeleton Placeholders
  avatarPlaceholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#e5e7eb",
    marginBottom: "1.5rem",
  },
  namePlaceholder: {
    width: "70%",
    height: "28px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "0.25rem",
  },
  locationPlaceholder: {
    width: "50%",
    height: "16px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "1.5rem",
  },
  labelPlaceholder: {
    display: "inline-block",
    width: "40px",
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "4px",
  },
  valuePlaceholder: {
    display: "inline-block",
    width: "120px",
    height: "14px",
    background: "#e5e7eb",
    borderRadius: "4px",
  },
  tagPlaceholder: {
    display: "inline-block",
    width: "70px",
    height: "24px",
    background: "#e5e7eb",
    borderRadius: "999px",
  },
};

export default Profile;
