import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as  yup from "yup";
import { normalizeCard } from "../utils/cards/NormalizeCard";
import { UnnormalizedCard } from "../interfaces/cards/UnnormalizedCard";
import { postNewCard } from "../services/cardsService";
import { errorMassage, successMassage } from "../services/feedbackService";
import { useNavigate } from "react-router-dom";

interface NewCardProps {
    
}
 
const NewCard: FunctionComponent<NewCardProps> = () => {

    let navigate = useNavigate();

     const formik: FormikValues = useFormik<FormikValues>({
        initialValues: {
        title: "",
        subtitle: "",
        description: "",
        phone: "",
        email: "",
        web: "",
        url: "",
        alt: "",
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
        },
        validationSchema: yup.object({
            title: yup.string().min(2).max(256).required(),
            subtitle: yup.string().min(2).max(256).required(),
            description: yup.string().min(2).max(1024).required(),
            phone: yup.string().min(9).max(11).required(),
            email: yup.string().email().min(5).required(),
            web: yup.string().min(7),
            url: yup.string().min(14),
            alt: yup.string().min(2).max(256),
            state: yup.string(),
            country: yup.string().required(),
            city: yup.string().required(),
            street: yup.string().required(),
            houseNumber: yup.string().min(1).required(),
            zip: yup.string(),
        }),
        onSubmit: (values, { resetForm }) => {
          let normalizedCard = normalizeCard(values as UnnormalizedCard);
          postNewCard(normalizedCard).then((res) => {
            console.log(res);
            successMassage("The card was added successfully."); 
            navigate("/");           
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
        <h2 className="display-2 text-center my-4">New Card</h2>
        <form onSubmit={formik.handleSubmit}>
        <div className="row g-2">
        <div className="col-md">
            <div className="form-floating mb-3">
                <input 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                type="text"
                className="form-control"
                id="title"
                placeholder="title"
                name="title"
                />
                <label htmlFor="title">Title</label>
                {formik.touched.title && formik.errors.title && (
                  <p className="text-danger">{formik.errors.title}</p>
                )}
            </div>
            </div>
            <div className="col-md">
            <div className="form-floating mb-3">
                <input 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subtitle}
                type="text"
                className="form-control"
                id="subtitle"
                placeholder="subtitle"
                name="subtitle"
                />
                <label htmlFor="subTitle">Subtitle</label>
                {formik.touched.subtitle && formik.errors.subtitle && (
                  <p className="text-danger">{formik.errors.subtitle}</p>
                )}
            </div>
            </div>
            </div>

            <div className="form-floating mb-3">
                <input 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                type="text"
                className="form-control"
                id="description"
                placeholder="description"
                name="description"
                />
                <label htmlFor="description">Description</label>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-danger">{formik.errors.description}</p>
                )}
            </div>

            <div className="row g-2">
            <div className="col-md-3">
            <div className="form-floating mb-3">
                <input 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                type="tel"
                className="form-control"
                id="phone"
                placeholder="phone"
                name="phone"
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
                placeholder="email"
                name="email"
                />
                <label htmlFor="email">Email</label>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-danger">{formik.errors.email}</p>
                )}
            </div>
            </div>            

            <div className="col-md">
            <div className="form-floating mb-3">
                <input 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.web}
                type="url"
                className="form-control"
                id="web"
                placeholder="web"
                name="web"
                />
                <label htmlFor="web">Web</label>
                {formik.touched.web && formik.errors.web && (
                  <p className="text-danger">{formik.errors.web}</p>
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
                value={formik.values.url}
                type="url"
                className="form-control"
                id="url"
                placeholder="url"
                name="url"
                />
                <label htmlFor="url">Url</label>
                {formik.touched.url && formik.errors.url && (
                  <p className="text-danger">{formik.errors.url}</p>
                )}
            </div>
            </div>

            <div className="col-md-5">
            <div className="form-floating mb-3">
                <input 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.alt}
                type="text"
                className="form-control"
                id="alt"
                placeholder="alt"
                name="alt"
                />
                <label htmlFor="alt">Alt</label>
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

          <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary mt-4 px-5 py-2"
            disabled={!formik.dirty || !formik.isValid}
          >
            Create
          </button>
          </div>

        </form>
        </div>
        </>
     );
}
 
export default NewCard;