import { User } from "@/types/Models.types";
import { Formik } from "formik";

interface ProfileFormProps {
  initialValues: Partial<User>;
  onSubmit: (values: User) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        onSubmit(values as User);
      }}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={values.firstName || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={values.lastName || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="addressOne"
            >
              Address Line 1
            </label>
            <input
              type="text"
              id="addressOne"
              name="addressOne"
              value={values.addressOne || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="addressTwo"
            >
              Address Line 2
            </label>
            <input
              type="text"
              id="addressTwo"
              name="addressTwo"
              value={values.addressTwo || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={values.city || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="state">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={values.state || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              maxLength={2}
              placeholder="e.g., CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="zipCode">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={values.zipCode || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              maxLength={9}
              placeholder="e.g., 12345 or 12345-6789"
            />
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
