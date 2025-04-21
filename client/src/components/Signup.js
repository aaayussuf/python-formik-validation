import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

export const SignupForm = () => {
  const [customers, setCustomers] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    fetch("/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, [refreshPage]);

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    name: yup.string().required("Must enter a name").max(15, "Name too long"),
    age: yup
      .number()
      .positive("Must be a positive number")
      .integer("Please enter an integer")
      .required("Must enter age")
      .typeError("Please enter an integer")
      .max(125, "Unrealistic age"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      age: "",
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) {
            setRefreshPage((prev) => !prev);
            resetForm();
          }
        })
        .catch((err) => console.error("Error submitting form:", err));
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Sign Up Form</h1>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px 0" }}>
        <div>
          <label htmlFor="email">Email Address</label>
          <br />
          <input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
          <p style={{ color: "red" }}>{formik.errors.email}</p>
        </div>

        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input id="name" name="name" type="text" onChange={formik.handleChange} value={formik.values.name} />
          <p style={{ color: "red" }}>{formik.errors.name}</p>
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <br />
          <input id="age" name="age" type="text" onChange={formik.handleChange} value={formik.values.age} />
          <p style={{ color: "red" }}>{formik.errors.age}</p>
        </div>

        <button type="submit">Submit</button>
      </form>

      <h2>Customer List</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>Name</th>
            <th style={{ border: "1px solid black" }}>Email</th>
            <th style={{ border: "1px solid black" }}>Age</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>Loading...</td>
            </tr>
          ) : (
            customers.map((c, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid black" }}>{c.name}</td>
                <td style={{ border: "1px solid black" }}>{c.email}</td>
                <td style={{ border: "1px solid black" }}>{c.age}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
