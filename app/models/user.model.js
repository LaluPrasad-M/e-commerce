const Yup = require("yup")
const moment = require("moment")

require('yup-phone')

//schema
const name = Yup.string().required("Name is Required");
const email = Yup.string().email("Please include a valid email").required("E-Mail is Required");
const password = Yup.string().required("Password is Required").min(6, "Password must contain at-least six characters");
const role_code = Yup.string().required("Role is Required");
const manager = Yup.mixed().default(null);
const phone = Yup.string().phone()
const dob = Yup.string().test("dob", "Please choose a valid date of birth", (value) => {
    return moment().diff(moment(value), "years") >= 10
})

exports.register_user_schema = Yup.object().shape({
    name, email, password, role_code, manager, phone, dob
});

exports.login_user_schema = Yup.object().shape({
    email, password
})

exports.update_user_schema = Yup.object().shape({
    name, email, phone, dob
});
