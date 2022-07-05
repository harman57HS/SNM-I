const {findUserAccountByEmail} = require("./user");
const {verify} = require("jsonwebtoken");
const {jwtConfig} = require("../config");


const verifyUser = async (req, res, next) => {
  const {token} = req.body

  try{
    const {email} = verify(token, jwtConfig.secret);
    const userAccount = await findUserAccountByEmail(email)
    if (!userAccount){
      return res.status(400).json({success: false, message: "No such user"})
    }
    if (userAccount.status !== "temporary"){
      return res.status(400).json({success: false, message: "The user is verified already"})
    }
    return res.status(200).json({success: true, message:'success', email: userAccount.primaryEmail, userId: userAccount._id})
  }catch (e){
    return next(e)
  }

}


module.exports = {verifyUser}