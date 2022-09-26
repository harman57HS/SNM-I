const {GDBCharacteristicModel} = require("../../models");
const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedModel} = require("../../models/need");


const createNeed = async (req, res, next) => {
  const form = req.body;
  // fetch characteristic and replace it into the form
  try {
    if (form.characteristic) {
      const characteristicId = form.characteristic;
      form.characteristic = await GDBCharacteristicModel.findById(characteristicId);
    }
    // fetch needSatisfier
    if (form.needSatisfier) {
      const needSatisfierId = form.needSatisfier;
      form.needSatisfier = await GDBNeedSatisfierModel.findById(needSatisfierId);
    }

    const need = GDBNeedModel(form);
    await need.save();
    return res.status(200).json({success: true});
  }catch (e) {
    return res.status(400).json({success: false, message: `failed to create need`});
  }
}

module.exports = {createNeed}