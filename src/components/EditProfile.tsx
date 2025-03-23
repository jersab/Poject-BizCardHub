import { FormikValues, useFormik } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { errorMassage, successMassage } from "../services/feedbackService";
import { getUserById, updateUser } from "../services/userService";
import { User } from "../interfaces/users/User";
import { UnnormalizedUserUpdate } from "../interfaces/users/UnnormalizedUserUpdate";
import { normalizeUserUpdate } from "../utils/normalizeUserUpdate";
import { decodeToken } from "../services/tokenService";
import { DecodedToken } from "../interfaces/auth/DecodedToken";

interface EditProfileProps {}

const EditProfile: FunctionComponent<EditProfileProps> = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      first: "",
      middle: "",
      last: "",
      phone: "",
      image: "",
      alt: "",
      state: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
    },
    validationSchema: yup.object({
      first: yup.string().min(2).max(256).required("שם פרטי הוא שדה חובה"),
      middle: yup.string().min(2).max(256),
      last: yup.string().min(2).max(256).required("שם משפחה הוא שדה חובה"),
      phone: yup.string().min(9).max(11).required("מספר טלפון הוא שדה חובה"),
      image: yup.string().min(14),
      alt: yup.string().min(2).max(256),
      state: yup.string().min(2).max(256),
      country: yup.string().min(2).max(256).required("מדינה היא שדה חובה"),
      city: yup.string().min(2).max(256).required("עיר היא שדה חובה"),
      street: yup.string().min(2).max(256).required("רחוב הוא שדה חובה"),
      houseNumber: yup.string().min(1).required("מספר בית הוא שדה חובה"),
      zip: yup.string().min(2).max(256).required("מיקוד הוא שדה חובה"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      if (!user || !user._id) {
        errorMassage("לא ניתן לעדכן פרטי משתמש");
        return;
      }

      const normalizedUser = normalizeUserUpdate(values as UnnormalizedUserUpdate);
      
      updateUser(user._id, normalizedUser)
        .then(() => {
          successMassage("פרטי המשתמש עודכנו בהצלחה");
          const updatedUser = { ...user, ...normalizedUser };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          window.location.href = "/";
        })
        .catch((err) => {
          console.error(err);
          errorMassage(err.response?.data || "שגיאה בעדכון פרטי המשתמש");
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = decodeToken(token) as DecodedToken;
      getUserById(decodedToken._id)
        .then((res) => {
          const userData = res.data;
          setUser(userData);
          
          formik.setValues({
            first: userData.name?.first || "",
            middle: userData.name?.middle || "",
            last: userData.name?.last || "",
            phone: userData.phone || "",
            image: userData.image?.url || "",
            alt: userData.image?.alt || "",
            state: userData.address?.state || "",
            country: userData.address?.country || "",
            city: userData.address?.city || "",
            street: userData.address?.street || "",
            houseNumber: userData.address?.houseNumber?.toString() || "",
            zip: userData.address?.zip?.toString() || "",
          });
          
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          errorMassage("שגיאה בטעינת פרטי המשתמש");
          navigate("/");
        });
    } catch (error) {
      console.error("שגיאה בפענוח הטוקן:", error);
      navigate("/login");
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">טוען...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-75 mx-auto">
        <h2 className="display-2 text-center my-4">עריכת פרטי משתמש</h2>
        <form className="mt-4" onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first}
                  type="text"
                  className="form-control"
                  id="first"
                  placeholder="שם פרטי"
                  name="first"
                  required
                />
                <label htmlFor="first">שם פרטי</label>
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
                  placeholder="שם אמצעי"
                  name="middle"
                />
                <label htmlFor="middle">שם אמצעי</label>
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
                  placeholder="שם משפחה"
                  name="last"
                  required
                />
                <label htmlFor="last">שם משפחה</label>
                {formik.touched.last && formik.errors.last && (
                  <p className="text-danger">{formik.errors.last}</p>
                )}
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="טלפון"
                  name="phone"
                  required
                />
                <label htmlFor="phone">טלפון</label>
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
                  value={formik.values.image}
                  type="url"
                  className="form-control"
                  id="image"
                  placeholder="קישור לתמונה"
                  name="image"
                />
                <label htmlFor="image">קישור לתמונה</label>
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
                  placeholder="תיאור תמונה"
                  name="alt"
                />
                <label htmlFor="alt">תיאור תמונה</label>
                {formik.touched.alt && formik.errors.alt && (
                  <p className="text-danger">{formik.errors.alt}</p>
                )}
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.state}
                  type="text"
                  className="form-control"
                  id="state"
                  placeholder="מחוז"
                  name="state"
                />
                <label htmlFor="state">מחוז</label>
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
                  placeholder="מדינה"
                  name="country"
                  required
                />
                <label htmlFor="country">מדינה</label>
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
                  placeholder="עיר"
                  name="city"
                  required
                />
                <label htmlFor="city">עיר</label>
                {formik.touched.city && formik.errors.city && (
                  <p className="text-danger">{formik.errors.city}</p>
                )}
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-floating mb-3">
                <input
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.street}
                  type="text"
                  className="form-control"
                  id="street"
                  placeholder="רחוב"
                  name="street"
                  required
                />
                <label htmlFor="street">רחוב</label>
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
                  placeholder="מספר בית"
                  name="houseNumber"
                  required
                />
                <label htmlFor="houseNumber">מספר בית</label>
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
                  placeholder="מיקוד"
                  name="zip"
                  required
                />
                <label htmlFor="zip">מיקוד</label>
                {formik.touched.zip && formik.errors.zip && (
                  <p className="text-danger">{formik.errors.zip}</p>
                )}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-5 py-2 me-2"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              שמור שינויים
            </button>
            <button
              type="button"
              className="btn btn-secondary px-5 py-2"
              onClick={() => navigate("/")}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;