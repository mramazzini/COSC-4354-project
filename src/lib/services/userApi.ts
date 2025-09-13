import { User, UserRole, VolunteerSkill } from "@/types/Models.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // getMe: builder.query<User, void>({
    //   query: () => ({
    //     url: "/user",
    //     method: "GET",
    //   }),
    // }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/user",
        method: "PUT",
        body,
      }),
    }),
  }),
});

//standin for getMe query
const useGetMeQuery = () => {
  const dummyUser: User = {
    id: "123",
    email: "user@gmail.com",
    firstName: "Matteo",
    lastName: "Ramazzini",
    addressOne: "address at 1123",
    addressTwo: "address at 2234",
    city: "Houston",
    state: "Tx",
    zipCode: "77055",
    skills: [VolunteerSkill.ChildCare, VolunteerSkill.ITSupport],
    otherSkills: ["skill1", "skill2"],
    preferences: "I like cats",
    availability: ["2023-10-10T10:00:00Z", "2023-10-11T14:00:00Z"],
    role: UserRole.Admin,
  };
  return { data: dummyUser, error: null, isLoading: false };
};

const { useUpdateUserMutation } = userApi;
export { useGetMeQuery, useUpdateUserMutation };
