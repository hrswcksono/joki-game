const {user, detail_user, order, paket} = require('../models');
const { decryptPW } = require('../helpers/bycript');
const { tokenGenrator,tokenVerifier } = require('../helpers/token');

class userController{
    static async detailUser(req, res){
        try{
            const access_token = req.headers.access_token;
            const id = tokenVerifier(access_token).id;
            //const id = req.params.id;
            let result = await user.findOne({
                where: {id},
                include:detail_user

            })
            res.status(200).json(result);
        }catch(err){
            res.status(500).json(err);
        }
    }

    static async create(req,res){
        try{
            const {nama, username, password, contact, description} = req.body;
            const role = "users"
            let result = await user.create({
                nama, username, password, role
            });
            if(!req.file){
                let result2 = await detail_user.create({
                    contact,
                    image: "",
                    description,
                    userId : result.id
                })
            }else{
                let result2 = await detail_user.create({
                    contact,
                    image: req.file.filename,
                    description,
                    userId : result.id
                })
            }
            res.status(201).json(result);
        }catch(err){
            res.status(500).json(err);
        }
    }

    static async update(req,res){
        try{
            const {nama, username, password, contact, description} = req.body;
            // const id = req.params.id;
            const access_token = req.headers.access_token;
            const id = tokenVerifier(access_token).id;
            const role = "users";
            let result = await user.update({
                nama, username, password, role
            },{
                where: {id}
            })
            let result2
            if(!req.file){
                result2 = await detail_user.update({
                    contact,
                    description
                },{
                    where:{
                        userId: id
                    }
                })
            }else{
                result2 = await detail_user.update({
                    contact,
                    image : req.file.filename,
                    description
                },{
                    where:{
                        userId: id
                    }
                })
            }
            if(result2 === 1){
                res.status(200).json({
                    message:`User id: ${id} has been updated`
                });
            }else{
                res.status(404).json({
                    message:`User id: ${id} not found`
                })
            }
        }catch(err){
            res.status(500).json(err);
        }
    }

    static async delete(req,res){
        try{
            const id = req.params.id;
            let result = await user.destroy({
                where: {id}
            });
            if(result === 1){
                res.status(200).json({
                    message:`User id: ${id} was deleted`
                });
            }else{
                res.status(404).json({
                    message:`User id: ${id} not found`
                })
            }
        }catch(err){
            res.status(500).json(err);
        }
    }

    static async createOrder(req,res){
        try{
            const access_token = req.headers.access_token;
            const userId = tokenVerifier(access_token).id;
            const paketId = req.params.id;
            let result = await order.create({
                userId,
                paketId,
                status: false,
                rating: 0
            })
            res.status(201).json({message: "berhasil create order"});
        }catch(err){
            res.status(500).json(err);
        }
    }

    static async listOrder(req,res){
        try{
            const access_token = req.headers.access_token;
            const userId = tokenVerifier(access_token).id;
            //const userId = req.params.userId
            let result = await order.findAll({
                where:{userId},
                include:{model:paket, include:user},
                order: [["id", "ASC"]],
            })
            res.status(200).json(result);
        }catch(err){
            res.status(404).json(err);
        }
    }

    static async detailOrder(req, res){
        try{
            const id = req.params.id;
            let result = await order.findOne({
                where:{id},
                include:{model:paket, include:user}
            })
            res.status(200).json(result);
        }catch(err){
            res.status(404).json(err);
        }
    }

    static async deleteOrder(req,res){
        try{
            const access_token = req.headers.access_token;
            const userId = tokenVerifier(access_token).id;
            const paketId = req.params.paketId;
            let result = await order.destroy({
                where:{userId,paketId}
            });
            if(result === 1){
                res.status(200).json({
                    message:`Order id: ${id} was deleted`
                });
            }else{
                res.status(404).json({
                    message:`Order id: ${id} not found`
                })
            }
        }catch(err){
            res.status(500).json(err);
        }
    }

    static async login(req,res){
        try{
            const {username, password} = req.body
            let result = await user.findOne({
                where: {username}
            })
            if(result){
                let pass = decryptPW(password, result.password)
                if(pass){
                    let access_token = tokenGenrator(result);
                    res.status(200).json(access_token);
                }else{
                    res.status(404).json({message:'wrong password'})
                }

            }else{
                res.status(404).json({message:'username not found'})
            }
        }catch(err){
            res.status(404).json(err);
        }
    }

    static async listPaket(req,res){
        try{
            let result = await paket.findAll({
                include:user
            })
            res.status(200).json(result);
        }catch(err){
            res.status(404).json({message:"not found"})
        }
    }

    static async upload(req,res){
        try{
            if(!req.file){
                console.log('no image')
            }else{
                console.log(req.file.filename)
            }
            //res.send({message:'no file'})
        }catch(err){
            res.send(err);
        }
    }

    static async rateOrder(req, res){
        try {
            const {rating} = req.body;
            const id = req.params.id;
            let result = await order.update({
                    rating
                },
                {
                    where:{id}
                }
            );
            if(result === 1){
                res.status(200).json({
                    message:`Rating order id: ${id} has been updated`
                });
            }else{
                res.status(404).json({
                    message:`Order id: ${id} not found`
                })
            }
        } catch (error) {
            
        }
    }
}

module.exports = userController