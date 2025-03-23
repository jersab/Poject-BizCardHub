import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import { unnormalizedUser } from "../interfaces/users/UnnormalizedUser";
import { normalizeUser } from "../utils/normalizeUser";
import { registerUser } from "../services/userService";
import { errorMassage, successMassage } from "../services/feedbackService";

interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
  const navigate = useNavigate();

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      first: "",
      middle: "",
      last: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      alt: "",
      state: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
      isBusiness: false,
    },
    validationSchema: yup.object({
      first: yup.string().min(2).max(256).required(),
      middle: yup.string().min(2).max(256),
      last: yup.string().min(2).max(256).required(),
      phone: yup.string().min(9).max(11).required(),
      email: yup.string().email().min(5).required(),
      password: yup.string().min(7).max(20).matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).+$/, "Password must contain at least one uppercase letter, one lowercase letter, and one special character").required(),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required(),
      image: yup.string().min(14),
      alt: yup.string().min(2).max(256),
      state: yup.string().min(2).max(256),
      country: yup.string().min(2).max(256).required(),
      city: yup.string().min(2).max(256).required(),
      street: yup.string().min(2).max(256).required(),
      houseNumber: yup.string().min(2).max(256).required(),
      zip: yup.string().min(2).max(256).required(),
      isBusiness: yup.boolean().required(),
    }),
    onSubmit: (values, { resetForm }) => {
      const normalizedUser = normalizeUser(values as unnormalizedUser);
      console.log(normalizedUser);
      registerUser(normalizedUser)
      .then((res) => {
        console.log(res);
        successMassage(`${res.data.email} registered successfully`);
        navigate("/login"); 
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
        <h2 className="display-2 text-center my-4">Register</h2>
        <form className="mt-5" onSubmit={formik.handleSubmit}>
          <div className="row g-2">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first}
                  type="text"
                  className="form-control"
                  id="first"
                  placeholder="John"
                  name="first"
                  required
                />
                <label htmlFor="first">First Name</label>
                {formik.touched.first && formik.errors.first && (
                  <p className="text-danger">{formik.errors.first}</p>
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.middle}
                  type="text"
                  className="form-control"
                  id="middle"
                  placeholder="Middle"
                  name="middle"
                />
                <label htmlFor="middle">Middle Name</label>
                {formik.touched.middle && formik.errors.middle && (
                  <p className="text-danger">{formik.errors.middle}</p>
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last}
                  type="text"
                  className="form-control"
                  id="last"
                  placeholder="Doe"
                  name="last"
                  required
                />
                <label htmlFor="last">Last Name</label>
                {formik.touched.last && formik.errors.last && (
                  <p className="text-danger">{formik.errors.last}</p>
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
                  value={formik.values.phone}
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="+972"
                  name="phone"
                  required
                />
                <label htmlFor="phone">Phone</label>
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-danger">{formik.errors.phone}</p>
                )}
              </div>
            </div>
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
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder=""
                  name="confirmPassword"
                  required
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-danger">{formik.errors.confirmPassword}</p>
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
                  value={formik.values.image}
                  type="url"
                  className="form-control"
                  id="image"
                  placeholder=""
                  name="image"
                />
                <label htmlFor="image">Profile Image</label>
                {formik.touched.image && formik.errors.image && (
                  <p className="text-danger">{formik.errors.image}</p>
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.alt}
                  type="text"
                  className="form-control"
                  id="alt"
                  placeholder=""
                  name="alt"
                />
                <label htmlFor="alt">Alternative Text</label>
                {formik.touched.alt && formik.errors.alt && (
                  <p className="text-danger">{formik.errors.alt}</p>
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
                  value={formik.values.state}
                  type="text"
                  className="form-control"
                  id="state"
                  placeholder=""
                  name="state"
                />
                <label htmlFor="state">State</label>
                {formik.touched.state && formik.errors.state && (
                  <p className="text-danger">{formik.errors.state}</p>
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                  type="text"
                  className="form-control"
                  id="country"
                  placeholder=""
                  name="country"
                  required
                />
                <label htmlFor="country">Country</label>
                {formik.touched.country && formik.errors.country && (
                  <p className="text-danger">{formik.errors.country}</p>
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                  type="text"
                  className="form-control"
                  id="city"
                  placeholder=""
                  name="city"
                  required
                />
                <label htmlFor="city">City</label>
                {formik.touched.city && formik.errors.city && (
                  <p className="text-danger">{formik.errors.city}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.street}
                  type="text"
                  className="form-control"
                  id="street"
                  placeholder=""
                  name="street"
                  required
                />
                <label htmlFor="street">Street</label>
                {formik.touched.street && formik.errors.street && (
                  <p className="text-danger">{formik.errors.street}</p>
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.houseNumber}
                  type="number"
                  className="form-control"
                  id="houseNumber"
                  placeholder=""
                  name="houseNumber"
                  required
                />
                <label htmlFor="houseNumber">House Number</label>
                {formik.touched.houseNumber && formik.errors.houseNumber && (
                  <p className="text-danger">{formik.errors.houseNumber}</p>
                )}
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.zip}
                  type="number"
                  className="form-control"
                  id="zip"
                  placeholder=""
                  name="zip"
                  required
                />
                <label htmlFor="zip">Zip Code</label>
                {formik.touched.zip && formik.errors.zip && (
                  <p className="text-danger">{formik.errors.zip}</p>
                )}
              </div>
            </div>
          </div>

          <div className="form-check">
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.isBusiness}
              className="form-check-input"
              type="checkbox"
              id="isBusiness"
              name="isBusiness"
            />
            <label className="form-check-label" htmlFor="isBusiness">
              Is Business ?
            </label>
            {formik.touched.isBusiness && formik.errors.isBusiness && (
              <p className="text-danger">{formik.errors.isBusiness}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-4 px-4 py-2"
            disabled={!formik.dirty || !formik.isValid}
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;