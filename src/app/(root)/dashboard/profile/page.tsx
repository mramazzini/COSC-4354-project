"use client";

import ProfileForm from "@/components/Forms/ProfileForm";
import { useUpdateUserMutation } from "@/lib/services/userApi";
import { useUser } from "@/lib/store/selectors";
import { User, VolunteerSkill } from "@prisma/client";
import { useCallback, useState } from "react";

const skillValues = Object.values(VolunteerSkill);

const skillLabel = (value: number | string) => {
  if (typeof value === "number") {
    return skillValues[value] ?? `Unknown (${value})`;
  }

  return value;
};

const ProfilePage = () => {
  const user = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const [updateUser, { isError, isLoading }] = useUpdateUserMutation();

  const handleSubmit = useCallback(
    async (values: Partial<User>) => {
      try {
        console.log("Submitting profile update with values:", values);
        await updateUser(values).unwrap();
        setIsEditing(false);
      } catch (e) {
        console.error("Failed to update user", e);
      }
    },
    [updateUser]
  );

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p>Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile</h2>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-sm"
            disabled={isLoading}
          >
            {isLoading ? "Saving…" : "Edit Profile"}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="card bg-base-100 shadow p-4 space-y-3">
          {isLoading && (
            <div className="alert alert-info py-2 text-sm">
              <span>Saving your changes…</span>
            </div>
          )}

          {isError && (
            <div className="alert alert-error py-2 text-sm">
              <span>Failed to save your profile. Please try again.</span>
            </div>
          )}

          <ProfileForm initialValues={user} onSubmit={handleSubmit} />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow p-4 space-y-2">
          <p className="text-base-content/80">
            Your profile details will be displayed here.
          </p>

          <div className="mt-2 space-y-1 text-sm">
            <div>
              <span className="font-semibold">Name:</span> {user.firstName}{" "}
              {user.lastName}
            </div>
            <div>
              <span className="font-semibold">Address:</span> {user.addressOne}
              {user.addressTwo ? `, ${user.addressTwo}` : ""}
            </div>
            <div>
              <span className="font-semibold">City/State:</span> {user.city},{" "}
              {user.state}
            </div>
            <div>
              <span className="font-semibold">Zip:</span> {user.zipCode}
            </div>

            <div className="mt-2">
              <span className="font-semibold">Skills:</span>{" "}
              {user.skills && user.skills.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {user.skills.map((s, idx) => (
                    <span key={idx} className="badge badge-outline">
                      {skillLabel(s as unknown as number)}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-base-content/70">None selected</span>
              )}
            </div>

            <div className="mt-2">
              <span className="font-semibold">Preferences:</span>{" "}
              <span className="text-base-content/80">
                {user.preferences || "None specified"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-sm mt-4"
            disabled={isLoading}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
