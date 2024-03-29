const {GDBCharacteristicModel} = require("../../models");
const {GDBNeedSatisfierModel} = require("../../models/needSatisfier");
const {GDBNeedModel} = require("../../models/need/need");
const {Server400Error} = require("../../utils");


const implementHelper = async (form) => {
  if (form.characteristic) {
    const characteristicId = form.characteristic;
    form.characteristic = await GDBCharacteristicModel.findById(characteristicId);
  } else {
    form.characteristic = undefined;
  }
  // fetch needSatisfier
  if(form.needSatisfiers){
    if (!Array.isArray(form.needSatisfiers))
      throw new Server400Error('Wrong input format');
    if (form.needSatisfiers.length > 0) {
      form.needSatisfiers = await GDBNeedSatisfierModel.find({_id: {$in: form.needSatisfiers}});
    } else {
      form.needSatisfier = [];
    }
  }
}
const formFormatChecking = (form) => {
  return (!form || !form.type || !form.changeType || !form.description || !form.characteristic || !form.needSatisfiers ||
    !(Array.isArray(form.needSatisfiers) || form.needSatisfiers.length === 0)) // todo: need to add codes checker
}

const createNeed = async (req, res, next) => {
  const form = req.body;
  if (formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'})
  try {

    await implementHelper(form);
    const need = GDBNeedModel(form);
    await need.save();
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchNeeds = async (req, res, next) => {
  try {
    const needs = await GDBNeedModel.find({}, {populates: ['characteristic']});
    return res.status(200).json({success: true, needs});
  } catch (e) {
    next(e);
  }
};

const deleteNeed = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    await GDBNeedModel.findByIdAndDelete(id);
    return res.status(200).json({success: true});
  } catch (e) {
    next(e);
  }
};

const fetchNeed = async (req, res, next) => {
  const {id} = req.params;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  try {
    const need = await GDBNeedModel.findById(id);
    if (need.characteristic)
      need.characteristic = need.characteristic.split('_')[1];
    if (need.needSatisfiers)
      need.needSatisfiers = need.needSatisfiers.map(needSatisfier => needSatisfier.split('_')[1])
    return res.status(200).json({success: true, need});
  } catch (e) {
    next(e);
  }

};

const updateNeed = async (req, res, next) => {
  const {id} = req.params;
  const form = req.body;
  if (!id)
    return res.status(400).json({success: false, message: 'Id is not provided'});
  if(formFormatChecking(form))
    return res.status(400).json({success: false, message: 'Wrong information format'});
  try{
    await implementHelper(form);
    const need = await GDBNeedModel.findById(id);
    need.type = form.type;
    need.changeType = form.changeType;
    need.description = form.description;
    need.characteristic = form.characteristic;
    need.needSatisfiers = form.needSatisfiers;
    need.codes = form.codes;
    await need.save();
    return res.status(200).json({success: true});
  }catch (e){
    next(e);
  }
}

module.exports = {createNeed, fetchNeeds, deleteNeed, fetchNeed, updateNeed};