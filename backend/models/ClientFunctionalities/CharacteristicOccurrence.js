const {createGraphDBModel, Types, DeleteType} = require("../../utils/graphdb");
const {GDBCharacteristicModel} = require("./characteristic");

/**
 * GDBCOModel stands for GDB - Characteristic Occurrence - Model
 * @type {GDBUtils.GraphDBModelConstructor}
 */
const GDBCOModel = createGraphDBModel({
  dataStringValue: {type: String, internalKey: ':hasStringValue'},
  dataNumberValue: {type: Number, internalKey: ':hasNumberValue'},
  dataBooleanValue: {type: Boolean, internalKey: ':hasBooleanValue'},
  dataDateValue: {type: Date, internalKey: 'hasDateValue'},
  objectValue: {type: [Types.NamedIndividual], internalKey: ':hasObjectValue'},
  occurrenceOf: {type: GDBCharacteristicModel, internalKey: ':occurrenceOf', onDelete: DeleteType.CASCADE},
}, {
  rdfTypes: [':CharacteristicOccurrence'], name: 'characteristicOccurrence'
});

module.exports = {
  GDBCOModel
}