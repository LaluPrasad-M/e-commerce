const role_modules_mapping = {
  //Root Users
  "RootAdmin_g9YUS2mRBc": ["module1A_9nhxVngR9U","submoduleXYZ_Ac1WNvaICb","emenucard_Mf9eyDrYZL","submoduleXYZ1_khHGFj5Bj1"],
  "RootManager_lwvOH8Qvqy": ["module1A_9nhxVngR9U","submoduleXYZ_Ac1WNvaICb","emenucard_Mf9eyDrYZL"],
  //Restaurant users
  "ShopManager_uao8RNiWUy": ["emenucard_Mf9eyDrYZL"],
  //Restaurant Customers
  "ShopABCCustomer_a6aYeCKPj6":["emenucard_Mf9eyDrYZL","submoduleXYZ1_khHGFj5Bj1"],
};

const module_content_mapping = {
  "emenucard_Mf9eyDrYZL": "MenuCardDetails_3U9wk9W7uE",
};

module.exports = {
  role_modules_mapping: role_modules_mapping,
  module_content_mapping: module_content_mapping,
};
