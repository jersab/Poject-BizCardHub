import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { loginUser, getUserById } from "../services/userService";
import { errorMassage, successMassage } from "../services/feedbackService";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../services/tokenService";
import { DecodedToken } from "../interfaces/auth/DecodedToken";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
  const navigate = useNavigate();

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().min(5).required(),
      password: yup
        .string()
        .min(7)
        .max(20)
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one special character"
        )
        .required(),
    }),
    onSubmit: (values, { resetForm }) => {
      loginUser(values)
        .then((res) => {
          const token = res.data;
          if (typeof token === "string" && token.trim()) {
            // שמירת הטוקן
            sessionStorage.setItem("token", token);
            
            // פענוח הטוקן והדפסה לבדיקה
            const decodedToken = decodeToken(token) as DecodedToken;
            console.log("Decoded token:", decodedToken);
            
            // קבלת פרטי המשתמש מהשרת
            getUserById(decodedToken._id)
              .then((userRes) => {
                const userData = userRes.data;
                console.log("User data from server:", userData);
                
                // שמירת פרטי המשתמש
                sessionStorage.setItem("user", JSON.stringify(userData));
                
                // בדיקה שהנתונים נשמרו
                const savedUser = sessionStorage.getItem("user");
                console.log("Saved user in sessionStorage:", savedUser);
                
                successMassage(`${values.email} logged in successfully`);
                
                // מעבר לדף הבית
                window.location.href = "/";  // שימוש בניווט מלא במקום navigate
              })
              .catch((err) => {
                console.error("Error fetching user data:", err);
                errorMassage("Login successful but failed to load user data");
                navigate("/");
              });
          } else {
            console.error("Token not found or invalid in the response", res.data);
            errorMassage("Login failed: token is invalid.");
          }
        })
        .catch((err) => {
          console.log(err);
          errorMassage(err.response.data);
        });
      resetForm();
    },
  });

  return (
    <>
      <div className="w-75 mx-auto">
        <h2 className="display-2 text-center my-4">Login</h2>
        <form className="mt-5" onSubmit={formik.handleSubmit}>
          <div className="row g-2">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="john@doe.com"
                  name="email"
                  required
                />
                <label htmlFor="email">Email</label>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-danger">{formik.errors.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder=""
                  name="password"
                  required
                />
                <label htmlFor="password">Password</label>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-danger">{formik.errors.password}</p>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4 px-4 py-2">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;