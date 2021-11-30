const Yup = require("yup")

const module_types = ["main", "sub"]

//schema
const name = Yup.string().required("Name is Required");
const type = Yup.string().oneOf(module_types,"Module type is incorrect").required("Module type cannot be empty");

exports.create_module_schema = Yup.object().shape({
    name, type
});
