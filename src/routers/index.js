const router = require('express').Router();
const APIError = require('../utils/errors');
const multer = require('multer');
const upload = require("../middlewares/lib/upload");
const auth =  require("./auth.routes");
const Response = require('../utils/response');

router.use( auth);

router.post("/upload", function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) 
            throw new APIError("Resim Yüklenirken Multer Kaynaklı Hata Çıktı : ", err)
        else if (err) 
            throw new APIError("Resim Yüklenirken Hata Çıktı : ", err)
        else return new Response(req.savedImages, "Yükleme Başarılı").success(res)
    })
})


module.exports = router;