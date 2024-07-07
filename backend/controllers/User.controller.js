import Users from "../models/User.model.js";
import bcrypt from "bcrypt"; // fungtion ini digunakan untuk menhast password menjadi sebuah code
import jwt from "jsonwebtoken"
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
        attributes:['id','name','email','password']
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

//function register

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: " Password dan confim password tidak cocok" });
  const salt = await bcrypt.genSalt();
  const hashpassword = await bcrypt.hash(password, salt);

  try {
    await Users.create({
      name: name,
      email: email,
      password: hashpassword,
    });
    res.json({ msg: "Register berhasil" }); //digunakan untuk menyimpan kedalam database
  } catch (error) {
    console.log(error)
  }
};


export const Login = async (req, res) =>{
    try {
        const user = await Users.findAll({
            where:{
                email:req.body.email
            }
            
        })
        //variabel berikut digunakan untuk membandingkan email yang dikirim oleh user dengan yang ada di dalam database
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if(!match) return res.status(400).json({msg:"password salah"})
            const userId = user[0].id
            const name = user[0].name
            const email = user[0].email
            const accsessToken = jwt.sign({userId,name,email}, process.env.ACCSESS_TOKEN_SECRET,{
                expiresIn: '300s'
            })
            const refreshToken = jwt.sign({userId,name,email}, process.env.REFRESH_TOKEN_SECRET,{
                expiresIn: '1d'
            })
            await Users.update({refresh_token:refreshToken},{
                where:{
                    id:userId
                }
            })
            res.cookie('refreshToken', refreshToken,{
                httpOnly:true,
                maxAge: 24*60*60*1000
            })
            res.json({accsessToken})
    } catch (error) {
        res.status(404).json({msg:"akun tidak ditemukan"})
    }
}