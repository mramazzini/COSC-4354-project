import { User, VolunteerSkill } from "@prisma/client";
import { Formik } from "formik";

interface ProfileFormProps {
  initialValues: Partial<User>;
  onSubmit: (values: Partial<User>) => void;
}

const allSkills = Object.values(VolunteerSkill);

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values, actions) => {
        console.log("Submitting profile form with values:", values);
        await onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={values.firstName || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          {/* Last Name */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={values.lastName || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          {/* Address One */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="addressOne"
            >
              Address Line 1
            </label>
            <input
              id="addressOne"
              name="addressOne"
              value={values.addressOne || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          {/* Address Two */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="addressTwo"
            >
              Address Line 2
            </label>
            <input
              id="addressTwo"
              name="addressTwo"
              value={values.addressTwo || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              value={values.city || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="state">
              State
            </label>
            <input
              id="state"
              name="state"
              value={values.state || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              maxLength={2}
            />
          </div>
          {/* Zip */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
              Zip Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              value={values.zipCode || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              maxLength={9}
            />
          </div>
          {/* Skills (multi-select) */}
          <div>
            <span className="block text-sm font-medium mb-1">Skills</span>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => {
                const selected = values.skills?.includes(skill) ?? false;
                return (
                  <label
                    key={skill}
                    className="flex items-center gap-2 text-sm border rounded px-2 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        const current = values.skills ?? [];
                        if (e.target.checked) {
                          setFieldValue("skills", [...current, skill]);
                        } else {
                          setFieldValue(
                            "skills",
                            current.filter((s) => s !== skill)
                          );
                        }
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="preferences"
            >
              Preferences
            </label>
            <textarea
              id="preferences"
              name="preferences"
              value={values.preferences || ""}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={4}
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ProfileForm;
