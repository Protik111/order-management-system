import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import useValidator from "../hooks/useValidator";
import axiosInstance from "../lib/axios";
import Spinner from "../components/ui/Spinner";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/shared/Header";

interface State {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
}

const Register: React.FC = () => {
  const [values, setValues] = useState<State>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "Male", // Default value for gender
  });
  const [loading, setLoading] = useState(false);
  const { email, password, firstName, lastName, gender } = values;

  const { errors, validate } = useValidator();
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const customMessages = {
      email: "Email is required!",
      password: "Password is required!",
      firstName: "First Name is required!",
      lastName: "Last Name is required!",
      gender: "Gender is required!",
    };

    const { isError } = validate(
      {
        email,
        password,
        firstName,
        lastName,
        gender,
      },
      customMessages
    );

    if (!isError) {
      setLoading(true);

      try {
        const response = await axiosInstance.post("/auth/register", {
          email,
          password,
          firstName,
          lastName,
          gender,
        });

        if (response?.data?.statusCode === 201) {
          toast.success("Registration successful! Please login.");
          navigate("/login");
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (error) {
          console.log(error);
          toast.error(
            axiosError?.response?.data?.message ??
              "Error on registration. Try again!"
          );
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="main_content mt-[4.2rem] py-10">
      <Header />
      <div className="container">
        <div className="form_wrapper px-6 py-10 lg:py-12 xl:py-15">
          <form className="max-w-28rem mx-auto mb-0" onSubmit={handleRegister}>
            <div className="form-title text-center">
              <h1 className="text-2xl font-semibold mb-2 leading-none">
                Register
              </h1>
              Create a new account
            </div>
            <br />

            {/* First Name */}
            <div className="form-group mt-4 text-left">
              <label className="text-sm lg:text-regular">
                First Name
                <span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
              />
              {errors?.firstName && (
                <span className="text-red-600 text-sm">
                  {errors?.firstName}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group mt-4 text-left">
              <label className="text-sm lg:text-regular">
                Last Name
                <span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
              />
              {errors?.lastName && (
                <span className="text-red-600 text-sm">{errors?.lastName}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group mt-4 text-left">
              <label className="text-sm lg:text-regular">
                Email Address
                <span className="text-red-600"> *</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
              {errors?.email && (
                <span className="text-red-600 text-sm">{errors?.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group mt-4 text-left">
              <label className="text-sm lg:text-regular">
                Password
                <span className="text-red-600"> *</span>
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
              {errors?.password && (
                <span className="text-red-600 text-sm">{errors?.password}</span>
              )}
            </div>

            {/* Gender */}
            <div className="form-group mt-4 text-left">
              <label className="text-sm lg:text-regular">
                Gender
                <span className="text-red-600"> *</span>
              </label>
              <select
                name="gender"
                value={gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors?.gender && (
                <span className="text-red-600 text-sm">{errors?.gender}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-group mt-4">
              <button
                type="submit"
                className="btn-dark-full relative text-regular"
              >
                {loading ? <Spinner /> : "Register"}
              </button>
            </div>
          </form>

          <Link to="/login">
            <p className="mt-4 text-green-600">Already have an account?</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
