"use client";
import ProfileForm from "@/components/Forms/ProfileForm";
import { useUpdateUserMutation } from "@/lib/services/userApi";
import { useUser } from "@/lib/store/selectors";
import { User } from "@/types/Models.types";
// User Profile Management (After registration, users should log in first to complete their profile). Following fields will be on the profile page/form:

import { useCallback, useState } from "react";

//     Full Name (50 characters, required)
//     Address 1 (100 characters, required)
//     Address 2 (100 characters, optional)
//     City (100 characters, required)
//     State (Drop Down, selection required) DB will store 2-character state code
//     Zip code (9 characters, at least 5-character code required)
//     Skills (multi-select dropdown, required)
//     Preferences (Text area, optional)

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { isError, isLoading }] = useUpdateUserMutation();
  const user = useUser();

  const handleSubmit = useCallback(
    (values: User) => {
      console.log("Form submitted with values:", values);
      updateUser(values);
      setIsEditing(false);
    },
    [updateUser]
  );

  return (
    <div>
      {isEditing ? (
        <div>
          <ProfileForm initialValues={user} onSubmit={handleSubmit} />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p>Your profile details will be displayed here.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
