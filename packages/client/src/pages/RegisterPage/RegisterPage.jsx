import React, { useState } from "react";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.scss";
import { useProvideAuth } from "../../hooks/useAuth";
import { LandingHeader, LoadingSpinner } from "../../components";
import { setAuthToken } from "../../utils/api.utils";
import * as yup from "yup";
import { useFormik } from "formik";

const initialState = {
  username: "",
  email: "",
  password: "",
  isSubmitting: false,
  errorMessage: null,
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .matches(/(?=.*[0-9])/),
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(10, "Password is too short - should be 8 characters minimum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number."),
});

const RegisterPage = () => {
  const [data, setData] = useState(initialState);
  const auth = useProvideAuth();

  let navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(getRandomProfileUrl());

  function getRandomProfileUrl() {
    //geneartes random pic in img
    let imgs = [
      "bird.svg",
      "dog.svg",
      "fox.svg",
      "frog.svg",
      "lion.svg",
      "owl.svg",
      "tiger.svg",
      "whale.svg",
    ];
    let img = imgs[Math.floor(Math.random() * imgs.length)];
    return `/${img}`;
  }

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignup = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });
    try {
      const res = await auth.signup(
        data.username,
        data.email,
        data.password,
        profileImage
      );
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: null,
      });
      setAuthToken(res.token);
      navigate("/");
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error ? error.message || error.statusText : null,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      username: data.username,
      email: data.email,
      password: data.password,
    },
    validationSchema,
    handleChange: handleInputChange(),
    onSubmit: handleSignup(),
  });

  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      <LandingHeader />
      <Container className="mb-5">
        <Row className="pt-5 justify-content-center">
          <Form style={{ width: "350px" }} onSubmit={formik.handleSubmit}>
            <h3 className="mb-3">Join Us! </h3>
            <Form.Group controlId="username-register">
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  required
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="email-register">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="Register">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                id="inputPasswordRegister"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </Form.Group>
            {data.errorMessage && (
              <span className="form-error text-warning">
                {data.errorMessage}
              </span>
            )}
            <Row className="mr-0">
              <Col>
                Already Registered?
                <Button
                  as="a"
                  variant="link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Col>
              <Button type="submit" disabled={data.isSubmitting}>
                {data.isSubmitting ? <LoadingSpinner /> : "Sign up"}
              </Button>
            </Row>
          </Form>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
