const Yup = require("yup")

require('yup-phone')

const user_types = ["admin", "manager", "employee", 'customer']

//schema
const role_name = Yup.string().required("Role name is Required");
const company_name = Yup.string().required("Company name is Required");
const user_type = Yup.string().oneOf(user_types).default('customer');
const requires_login = Yup.boolean().oneOf([true, false]).default(true);

exports.create_role_schema = Yup.object().shape({
    role_name, company_name, user_type, requires_login
});
